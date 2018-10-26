import { TSucreioRequest } from '../../../utils/request';

import Sucreio from '../../../classes/Sucreio';



import { createFetchWrapper, PRODUCTS, VERSIONS, processJSON, wrapSucreioRequest } from '../../../utils/request';
import { createRemapper, normalizeAssetId } from '../../../utils/remap';
import { accountSchema } from './accounts.x';




const fetch = createFetchWrapper(PRODUCTS.SUCREIO, VERSIONS.V1, processJSON);

const preCreateAsync = (data) => accountSchema.parse(data);
const postCreate = createRemapper({
    type: null
});

export default {

  create: wrapSucreioRequest(Sucreio.AccountCreation, preCreateAsync, postCreate, (postParams) => {
      return fetch('/accounts', postParams);
  }) as TSucreioRequest,

};
