import {Chaincode, Helpers, StubHelper} from '@theledger/fabric-chaincode-utils';
import {array, number, object, string} from 'yup';
import {CreatePropertyRequest} from './create.property.request';
import {Property} from './property';
import {DocType} from './doc.type';
import {createHash} from 'crypto';
import {FindPropertyRequest} from './find.property.request';
import {SetOwnerRequest} from './set.owner.request';
import {GeoCoordinate} from './geo.coordinate';
import * as geolib from 'geolib';

export class PropertyChainCode extends Chaincode {

  constructor() {
    super();
  }

  async createProperty(stubHelper: StubHelper, args: string[]): Promise<void> {
    const verifiedArgs = await Helpers.checkArgs<CreatePropertyRequest>(args[0], object({
      propertyId: string().required(),
      latitude: number().required(),
      longitude: number().required(),
      ownerId: string().required(),
      boundaryData: array().required() // TODO: Use a URL pointing to the binary data in future to enable usage of large documents
    }));

    // const newBoundaries = this.toPolygon(verifiedArgs.boundaryData);
    const closeProperties =
      await this.findCloseProperties(stubHelper, {latitude: verifiedArgs.latitude, longitude: verifiedArgs.longitude});
    for (const p of closeProperties) {
      if (this.overlaps(p.boundaryData, verifiedArgs.boundaryData)) {
        throw new Error('Property overlaps another');
      }
    }

    // Create hash of the boundary data
    const boundaryHash = await this.calculateHah(JSON.stringify(verifiedArgs.boundaryData));

    const property: Property = {
      id: verifiedArgs.propertyId,
      docType: DocType.Property,
      ownerId: verifiedArgs.ownerId,
      boundaryHash: boundaryHash,
      boundaryData: verifiedArgs.boundaryData,
      centre: {
        latitude: verifiedArgs.latitude,
        longitude: verifiedArgs.longitude
      }
    };
    await stubHelper.putState(verifiedArgs.propertyId, property);
  }

  async findCloseProperties(stubHelper: StubHelper, loc: GeoCoordinate): Promise<Property[]> {
    const distance = 100;
    const bottomPoint = geolib.computeDestinationPoint(loc, distance, 180);
    const topPoint = geolib.computeDestinationPoint(loc, distance, 0);
    const eastPoint = geolib.computeDestinationPoint(loc, distance, 90);
    const westPoint = geolib.computeDestinationPoint(loc, distance, 270);
    const results = await stubHelper.getQueryResultAsList({
      selector: {
        '$and': [
          {
            'centre.latitude': {
              '$gt': bottomPoint.latitude
            }
          },
          {
            'centre.latitude': {
              '$lt': topPoint.latitude
            }
          },
          {
            'centre.longitude': {
              '$gt': westPoint.longitude
            }
          },
          {
            'centre.longitude': {
              '$lt': eastPoint.longitude
            }
          }
        ]
      }
    });

    const properties = results as Property[];
    const coordinates = properties.map(property => ({...property.centre, property}));
    geolib.orderByDistance(loc, coordinates);
    return coordinates.map(c => c.property);

  }

  toPolygon(boundaryData: string): GeoCoordinate[] {
    return JSON.parse(boundaryData);
  }

  overlaps(bounds1: GeoCoordinate[], bounds2: GeoCoordinate[]): boolean {
   return !!bounds1.find(bound => geolib.isPointInside(bound, bounds2));
  }

/*  async getBoundaryData(propertyId: string): Promise<GeoCoordinate[]> {
    const data = await this.objectStore.get(propertyId);
    return JSON.parse(data);
  }*/

  async setOwner(stubHelper: StubHelper, args: string[]): Promise<void> {
    const verifiedArgs = await Helpers.checkArgs<SetOwnerRequest>(args[0], object({
      ownerId: string().required(),
      propertyId: string().required()
    }));
    const property = await this.findPropertyFromId(stubHelper, verifiedArgs.propertyId);
    property.ownerId = verifiedArgs.ownerId;
    return await stubHelper.putState(verifiedArgs.propertyId, property);
  }

  async findProperty(stubHelper: StubHelper, args: string[]): Promise<Property>  {
    const readPropertyRequest = await Helpers.checkArgs<FindPropertyRequest>(args[0], object({
      id: string().required()
    }));
    return await this.findPropertyFromId(stubHelper, readPropertyRequest.id);
  }

  // TODO: Change this to a more advanced hashing algorithm that reduces the probability of clashes
  private async calculateHah(input: string): Promise<string> {
    const hash = createHash('md5');
    hash.update(input);
    return hash.digest('hex');
  }

  private async findPropertyFromId(stubHelper: StubHelper, propertyId: string): Promise<Property> {
    return (await stubHelper.getStateAsObject(propertyId)) as Property;
  }


}
