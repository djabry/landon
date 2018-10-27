import {PropertyChainCode} from './property.chain.code';
import {describe} from 'mocha';
import {ChaincodeMockStub, Transform} from '@theledger/fabric-mock-stub';
import {expect} from 'chai';
import {CreatePropertyRequest} from './create.property.request';
import {FindPropertyRequest} from './find.property.request';
import {Property} from './property';

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
      boundaryData: 'bar',
      ownerId: 'person1'
    };
    const response = await stub.mockInvoke('tx1', ['createProperty', JSON.stringify(request)]);
    expect(response.status).to.equal(200, 'Failed to create property');

  });

  it('Gets some land data', async () => {
    const request: CreatePropertyRequest = {
      propertyId: 'foo',
      boundaryData: 'bar',
      ownerId: 'person1'
    };
    const writeResponse = await stub.mockInvoke('tx1', ['createProperty', JSON.stringify(request)]);
    expect(writeResponse.status).to.equal(200, 'Failed to create property');

    const findPropertyRequest: FindPropertyRequest = {
      id: request.propertyId
    };
    const readResponse = await stub.mockInvoke('tx2', ['findProperty', JSON.stringify(findPropertyRequest)]);
    const propertyObject = Transform.bufferToObject(readResponse.payload) as Property;
    expect(propertyObject.ownerId).to.equal(request.ownerId);
    expect(propertyObject.boundaryHash).to.be.a('string').and.have.lengthOf(32);
  });



});
