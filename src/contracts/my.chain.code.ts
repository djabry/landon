import {Chaincode, Helpers, StubHelper} from '@theledger/fabric-chaincode-utils';
import {createHash} from 'crypto';
import {object, string} from 'yup';
import {CreatePropertyRequest} from './create.property.request';
import {Property} from './property';
import {DocType} from './doc.type';

export class MyChainCode extends Chaincode {

  async createLand(stubHelper: StubHelper, args: string[]): Promise<void> {
    const verifiedArgs = await Helpers.checkArgs<CreatePropertyRequest>(args[0], object({
      propertyId: string().required(),
      ownerId: string().required(),
      boundaryData: string().required() // TODO: Use a URL containing the binary data in future to enable usage of large documents
    }));

    // Create hash of the boundary data
    const boundaryHash = await this.calculateHah(verifiedArgs.boundaryData);

    const property: Property = {
      docType: DocType.Property,
      ownerId: verifiedArgs.ownerId,
      boundaryHash: boundaryHash
    };

    await stubHelper.putState(verifiedArgs.propertyId, property);
  }

  // TODO: Change this to a more advanced hashing algorithm that reduces the probability of clashes
  private async calculateHah(input: string): Promise<string> {
    const hash = createHash('md5');
    hash.update(input);
    return hash.digest('hex');
  }


}
