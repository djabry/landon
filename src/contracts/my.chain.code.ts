import {Chaincode, Helpers, StubHelper} from '@theledger/fabric-chaincode-utils';
import {object, number, string} from 'yup';
export class MyChainCode extends Chaincode {

  async createStrip(stubHelper: StubHelper, args: string[]): Promise<void> {
    const verifiedArgs = await Helpers.checkArgs(args[0], object({
      start: number().required().positive().integer(),
      length: number().required().positive().integer(),
      userId: string().required()
    }));

    await stubHelper.setEvent('foo', verifiedArgs);
  }
}
