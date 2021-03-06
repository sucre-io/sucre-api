import { TSucreioRequest } from '../../../utils/request';
import Sucreio from '../../../classes/Sucreio';
import { createFetchWrapper, PRODUCTS, VERSIONS, processJSON, wrapSucreioRequest, headerTemplate } from '../../../utils/request';
import { createRemapper, normalizeAssetId } from '../../../utils/remap';
import { accountSchema } from './accounts.x';

const fetch = createFetchWrapper(PRODUCTS.SUCREIO, VERSIONS.V1, processJSON);

const preCreateAsync = (data) => accountSchema.parse(data);
const postCreate = createRemapper({
    type: null
});

export default {

  create: wrapSucreioRequest(Sucreio.AccountCreation, preCreateAsync, postCreate, (postParams) => {
      return fetch('/api/v1/accounts', postParams);
  }) as TSucreioRequest,

  authenticate: wrapSucreioRequest(Sucreio.AccountCreation, preCreateAsync, postCreate, (postParams) => {
      return fetch('/api/v1/authenticate', postParams);
  }) as TSucreioRequest,

  getAccount(id: string, token='') {
      return fetch(`/api/v1/accounts/${id}`, headerTemplate('GET', token));
  },

};
