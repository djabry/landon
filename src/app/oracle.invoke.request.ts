import {FunctionName} from '../../contracts/src/function.name';
import {ChainCodeName} from '../../contracts/src/chain.code.name';
import {Channel} from '../../contracts/src/channel';

export interface OracleInvokeRequest {
  channel:  Channel;
  chaincode:  ChainCodeName;
  method:  FunctionName;
  chaincodeVer:  string;
  args:  string[];
  proposalWaitTime?: number;
  transactionWaitTime?: number;
}
