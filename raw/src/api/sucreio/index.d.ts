import { IHash } from '../../../interfaces';
export interface ISucreioAPIv1 {
    accounts: {
        create(data: IHash<any>, token: string): Promise<any>;
        authenticate(data: IHash<any>, token: string): Promise<any>;
        getAccount(id: string, token: string): Promise<any>;
    };
    posts: {
        createPost(data: IHash<any>, token: string): Promise<any>;
        getAllPost(token: string): Promise<any>;
    };
}
export declare const v1: ISucreioAPIv1;
