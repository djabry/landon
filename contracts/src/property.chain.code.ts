import {Chaincode, Helpers, StubHelper} from '@theledger/fabric-chaincode-utils';
import {number, object, string} from 'yup';
import {CreatePropertyRequest} from './create.property.request';
import {Property} from './property';
import {DocType} from './doc.type';
import {createHash} from 'crypto';
import {FindPropertyRequest} from './find.property.request';
import {SetOwnerRequest} from './set.owner.request';

export class PropertyChainCode extends Chaincode {

  async createProperty(stubHelper: StubHelper, args: string[]): Promise<void> {
    const verifiedArgs = await Helpers.checkArgs<CreatePropertyRequest>(args[0], object({
      propertyId: string().required(),
      latitude: number().required(),
      longitude: number().required(),
      ownerId: string().required(),
      boundaryData: string().required() // TODO: Use a URL pointing to the binary data in future to enable usage of large documents
    }));

    // Create hash of the boundary data
    const boundaryHash = await this.calculateHah(verifiedArgs.boundaryData);

    const property: Property = {
      docType: DocType.Property,
      ownerId: verifiedArgs.ownerId,
      boundaryHash: boundaryHash,
      centre: {
        latitude: verifiedArgs.latitude,
        longitude: verifiedArgs.longitude
      }
    };
    await stubHelper.putState(verifiedArgs.propertyId, property);
  }

  async findCloseProperties(stubHelper: StubHelper, property: Property): Promise<Property> {
    const properties = await stubHelper.getQueryResultAsList({
      selector: {
        'centre.latitude': {
          '$gt': ''
        }
      }
    });

  }

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
