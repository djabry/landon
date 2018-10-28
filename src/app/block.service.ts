import {Injectable} from '@angular/core';
import {Property} from '../../contracts/src/property';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {FindPropertyRequest} from '../../contracts/src/find.property.request';
import {OracleInvokeRequest} from './oracle.invoke.request';
import {Channel} from '../../contracts/src/channel';
import {ChainCodeName} from '../../contracts/src/chain.code.name';
import {FunctionName} from '../../contracts/src/function.name';
import {AuthenticationService} from './authentication.service';
import {CreatePropertyRequest} from '../../contracts/src/create.property.request';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(private httpClient: HttpClient, private authService: AuthenticationService) {
  }

  toOracleRequest(functionName: FunctionName, input: any): OracleInvokeRequest {
    return {
      channel: Channel.landon,
      chaincode: ChainCodeName.landon,
      method: functionName,
      chaincodeVer: '1.0',
      args: [JSON.stringify(input)]
    };
  }

  async invoke<I, O>(input: I, functionName: FunctionName): Promise<O> {
    const creds = await this.authService.requestBlockchainCredentials();
    const resource = `${environment.proxyEndpoint}/invoke`;
    const request = this.toOracleRequest(functionName, input);
    const response = await this.httpClient.post(resource, JSON.stringify(request), {
      headers: {
        ...this.authService.toRequestHeaders(creds),
        'Content-Type': 'application/json'
      }
    }).toPromise();
    return response as O;
  }

  async listProperties(): Promise<Property[]> {
    return [];
  }

  async findProperty(propertyId: string): Promise<Property> {
    const findPropertyRequest: FindPropertyRequest = {
      id: propertyId
    };
    return this.invoke<FindPropertyRequest, Property>(findPropertyRequest, FunctionName.findProperty);
  }

  async createProperty(request: CreatePropertyRequest): Promise<any> {
    return await this.invoke(request, FunctionName.createProperty);
  }

}
