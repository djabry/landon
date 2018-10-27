import {Chaincode, Helpers, StubHelper} from '@theledger/fabric-chaincode-utils';
import {createHash} from 'crypto';
import {object, number, string} from 'yup';
export class MyChainCode extends Chaincode {

  async createLand(stubHelper: StubHelper, args: string[]): Promise<void> {
    const verifiedArgs = await Helpers.checkArgs(args[0], object({
      propertyId: string().required(),
      ownerId: string().required(),
      data: string().required() // TODO: Use a URL containing the binary data in future to enable usage of large documents
    }));

    // 1. Create hash of the data supplied by the data URL
    const hash = await this.calculateHah(verifiedArgs.data);
    await stubHelper.setEvent(verifiedArgs.propertyId, {
      hash,
      docType: 'land',
      ownerId: verifiedArgs.ownerId
    });
  }

  // TODO: Change this to a more advanced hashing algorithm that reduces the probability of clashes
  private async calculateHah(input: string): Promise<string> {
    const hash = createHash('md5');
    hash.update(input);
    return hash.digest('hex');
  }


}
