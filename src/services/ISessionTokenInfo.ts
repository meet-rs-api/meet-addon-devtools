import { ITokenInfo } from "./ITokenInfo";

export interface ISessionTokenInfo {
    token: ITokenInfo;
    resourceType: number;
    resourceId: string;
}