import {PropertyChainCode} from './property.chain.code';
import {describe} from 'mocha';
import {ChaincodeMockStub, Transform} from '@theledger/fabric-mock-stub';
import {expect} from 'chai';
import {CreatePropertyRequest} from './create.property.request';
import {FindPropertyRequest} from './find.property.request';
import {Property} from './property';
import {SetOwnerRequest} from './set.owner.request';
import {FunctionName} from './function.name';
import * as geolib from 'geolib';
import {RandomPolygonGenerator} from '../../src/app/random.polygon.generator';

let instance: PropertyChainCode;
let stub;
describe('Property chain code', () => {

  before('Create the chain code and stub', () => {
    instance = new PropertyChainCode();
  });

  beforeEach('Create a stub', () => {
    stub = new ChaincodeMockStub('MockPropertyCodeStub', instance);
  });

  it('Initialises', async () => {
    const response = await stub.mockInit('tx1', []);
    expect(response.status).to.equal(200, 'Failed to initialise');
  });

  it('Creates some land', async () => {
    const request: CreatePropertyRequest = {
      propertyId: 'foo',
      latitude: 0,
      longitude: 0,
      boundaryData: [{latitude: 0, longitude: 0}],
      ownerId: 'person1'
    };
    const response = await stub.mockInvoke('tx1', [FunctionName.createProperty, JSON.stringify(request)]);
    expect(response.status).to.equal(200, 'Failed to create property');
  });

  describe('Existing property data', () => {
    let createRequest: CreatePropertyRequest;

    beforeEach('Write some property data', async () => {
      createRequest = {
        latitude: 0,
        longitude: 0,
        propertyId: 'foo',
        boundaryData: [{latitude: 0, longitude: 0}],
        ownerId: 'person1'
      };
      const writeResponse = await stub.mockInvoke('tx1', [FunctionName.createProperty, JSON.stringify(createRequest)]);
      expect(writeResponse.status).to.equal(200, 'Failed to create property');
    });

    it('Gets some land data', async () => {
      const findPropertyRequest: FindPropertyRequest = {
        id: createRequest.propertyId
      };
      const readResponse = await stub.mockInvoke('tx2', [FunctionName.findProperty, JSON.stringify(findPropertyRequest)]);
      const propertyObject = Transform.bufferToObject(readResponse.payload) as Property;
      expect(propertyObject.ownerId).to.equal(createRequest.ownerId);
      expect(propertyObject.boundaryHash).to.be.a('string').and.have.lengthOf(32);
    });

    it('Changes the owner id', async () => {
      const request: SetOwnerRequest = {
        ownerId: `${createRequest.ownerId}1`,
        propertyId: createRequest.propertyId
      };
      const response = await stub.mockInvoke('tx1', [FunctionName.setOwner, JSON.stringify(request)]);
      expect(response.status).to.equal(200, 'Failed to set owner');
      const findPropertyRequest: FindPropertyRequest = {
        id: createRequest.propertyId
      };
      const readResponse = await stub.mockInvoke('tx2', [FunctionName.findProperty, JSON.stringify(findPropertyRequest)]);
      const propertyObject = Transform.bufferToObject(readResponse.payload) as Property;
      expect(propertyObject.ownerId).to.equal(request.ownerId);

    });

  });

  describe('Properties close together', () =>  {

    let polyGen: RandomPolygonGenerator;

    it('Create some properties with overlapping boundaries', async () => {
      polyGen = new RandomPolygonGenerator();
      const centralPoint = {
        latitude: 0,
        longitude: 0
      };
      const centralProperty: CreatePropertyRequest = {
        ...centralPoint,
        propertyId: 'central',
        boundaryData: polyGen.generatePolygon(centralPoint),
        ownerId: 'person1'
      };

      const topPoint = geolib.computeDestinationPoint(centralPoint, 50, 0);

      const topProperty = {
        ...topPoint,
        boundaryData: polyGen.generatePolygon(centralPoint),
        propertyId: 'top',
        ownerId: 'person2'
      };

      const eastPoint = geolib.computeDestinationPoint(centralPoint, 50, 90);

      const eastProperty = {
        ...eastPoint,
        propertyId: 'east',
        boundaryData: polyGen.generatePolygon(centralPoint),
        ownerId: 'person3'
      };

      const southPoint = geolib.computeDestinationPoint(centralPoint, 50, 180);

      const southProperty = {
        ...southPoint,
        propertyId: 'south',
        boundaryData: polyGen.generatePolygon(centralPoint),
        ownerId: 'person3'
      };

      const westPoint = geolib.computeDestinationPoint(centralPoint, 50, 270);

      const westProperty = {
        ...westPoint,
        propertyId: 'west',
        boundaryData: polyGen.generatePolygon(centralPoint),
        ownerId: 'person4'
      };

      const createPropertyRequests = [centralProperty, eastProperty, southProperty, westProperty];

      const responses = [];
      for (const request of createPropertyRequests) {
        const writeResponse = await stub.mockInvoke('tx1', [FunctionName.createProperty, JSON.stringify(request)]);
        responses.push(writeResponse);
      }

      const failedWrite = responses.find(response => {
        return response.status !== 200;
      });

      expect(failedWrite).to.be.an('object', 'Should have failed to create some properties');

    });



  });





});
