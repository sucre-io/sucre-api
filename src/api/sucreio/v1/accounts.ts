import { createFetchWrapper, PRODUCTS, VERSIONS, processJSON, wrapTransactionRequest } from '../../../utils/request';
import { createRemapper, normalizeAssetId } from '../../../utils/remap';



const fetch = createFetchWrapper(PRODUCTS.SUCREIO, VERSIONS.V1, processJSON);


export default {

  create(data) {
    return fetch(`/signup`).then((res) => {
      return res;
    });
  },

};
