export interface ISucreioAPIv1 {
    accounts: {
        create(data: string): Promise<any>;
    };
}
export declare const v1: ISucreioAPIv1;
