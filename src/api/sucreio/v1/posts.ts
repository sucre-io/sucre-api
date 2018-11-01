import { TSucreioRequest } from '../../../utils/request';
import Sucreio from '../../../classes/Sucreio';
import { createFetchWrapper, PRODUCTS, VERSIONS, processJSON, wrapSucreioRequest, headerTemplate} from '../../../utils/request';
import { createRemapper, normalizeAssetId } from '../../../utils/remap';
import { postSchema } from './posts.x';

const fetch = createFetchWrapper(PRODUCTS.SUCREIO, VERSIONS.V1, processJSON);

const preCreateAsync = (data) => postSchema.parse(data);
const postCreate = createRemapper({
    type: null
});

export default {

  createPost: wrapSucreioRequest(Sucreio.PostCreation, preCreateAsync, postCreate, (postParams) => {
      return fetch('/api/v1/post', postParams);
  }) as TSucreioRequest,


  getAllPost(token: string) {
      return fetch('/api/v1/posts', headerTemplate('GET', token));
  },

};
