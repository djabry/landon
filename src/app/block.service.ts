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

  async findProperty(propertyId: string): Promise<Property> {
    const creds = await this.authService.requestCredentials();
    const resource = `${environment.oracleEndpoint}/bcsgw/rest/v1/transaction/invocation`;
    const findPropertyRequest: FindPropertyRequest = {
      id: propertyId
    };
    const request = this.toOracleRequest(FunctionName.findProperty, findPropertyRequest);
    const response = await this.httpClient.post(resource, resource, {
      headers: {
        ...this.authService.toRequestHeaders(creds),
        'Content-Type': 'application/json'
      }
    }).toPromise();

    return null;
  }

}
