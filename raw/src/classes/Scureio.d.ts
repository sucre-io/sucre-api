export interface IScureioClass {
    prepareForAPI(privateKey: string): Promise<any>;
}
export interface IScureioClassConstructor {
    new (hashMap: any): IScureioClass;
}
declare const _default: {
    AccountCreation: IScureioClassConstructor;
};
export default _default;
