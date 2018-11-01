import { TSucreioRequest } from '../../../utils/request';
declare const _default: {
    create: TSucreioRequest;
    authenticate: TSucreioRequest;
    getAccount(id: string, token: string): Promise<any>;
};
export default _default;
