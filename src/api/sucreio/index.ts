import { IHash, IKeyPair } from '../../../interfaces';

import v1Accounts from './v1/accounts';
import v1Posts from './v1/posts';

export interface ISucreioAPIv1 {
    accounts: {
        create(data: IHash<any>, token: string): Promise<any>;
        authenticate(data: IHash<any>, token: string): Promise<any>;
        getAccount(id: string, token: string): Promise<any>;
    },
    posts: {
        createPost(data: IHash<any>, token: string): Promise<any>;
        getAllPost(token: string): Promise<any>;
    },

}

export const v1: ISucreioAPIv1 = {
  accounts: v1Accounts,
  posts: v1Posts
};
