import { ITokenInfo } from "./ITokenInfo";
import { AddonRuntimeInfo } from "./AddonRuntimeInfo";

/**
 * This is class which can be used for local development of the SDK addon
 * and which provides an easy way to retrieve auth token using the global variables.
 * 
 * The host address, key and secret are defined in the local storage in the browser 
 * developer is using for developing addon so they will be preserved even on page reloads
 * browser closing etc. 
 * 
 * At the end of the development - developer should clear his local storage.
 *
 * @export
 * @class TokenService
 */
export class TokenService {

    /**
     * Gets the runtime context addon will receive during the Meet session
     * to simulate the ongoing meeting
     *
     * @param {string} session An session token containing resource claims.
     * @returns {Promise<ITokenInfo>}
     * @memberof TokenService
     */
    public getAddonRuntimeInfoAsync = async (sessionToken: string): Promise<AddonRuntimeInfo> => {
        
        const host = localStorage.getItem("meet-dev-sdk-host");
        const addonIdentifier = localStorage.getItem("meet-dev-sdk-addon-id");
        if (!host || !addonIdentifier ) {
            return Promise.reject("To use token service please define in local storage meet-dev-sdk-host and meet-dev-sdk-addon-id");
        } 

        const r = await fetch(`${host}/v1/meetingAddons/${addonIdentifier}`, {
            headers: {
                "Authorization": `bearer ${sessionToken}`,
                "Content-Type": "application/json",
            },
            method: "GET",
        });
        return await r.json();
    }

    /**
     * Gets the token populated with all the claims user will have after logging to a specific 
     * Meet session (meeting code, role etc)
     *
     * @param {string} tenantToken An api token containing tenant claims.
     * @param {string} meetCode Meet code for which session token shoudl be issued. If omited new meetign will be created.
     * @returns {Promise<ITokenInfo>}
     * @memberof TokenService
     */
    public getSessionTokenAsync = async (tenantToken: string, meetCode: string = "new") : Promise<ITokenInfo> => {

        const host = localStorage.getItem("meet-dev-sdk-host");
        if (!host) {
            return Promise.reject("To use token service please define in local storage meet-dev-sdk-host, meet-dev-sdk-key and meet-dev-sdk-secret");
        } 

        const r = await fetch(`${host}/v1/token/session/${meetCode}`, {
            headers: {
                "Authorization": `bearer ${tenantToken}`,
                "Content-Type": "application/json",
            },
            method: "GET",
        });
        return await r.json();
    }

    /**
     * Gets the general purpose api token without any specific Meet claims 
     * but instead only tenant claims.
     *
     * @returns {Promise<ITokenInfo>} An tenant api key containing the tenant claims 
     * @memberof TokenService
     */
    public getTenantTokenAsync = async () : Promise<ITokenInfo> => {

        const host = localStorage.getItem("meet-dev-sdk-host");
        const key = localStorage.getItem("meet-dev-sdk-key");
        const secret = localStorage.getItem("meet-dev-sdk-secret");

        if (!host || !key || !secret ) {
            return Promise.reject("To use token service please define in local storage meet-dev-sdk-host, meet-dev-sdk-key and meet-dev-sdk-secret");
        } 

        const r = await fetch(`${host}/v1/token`, {
            body: JSON.stringify({
                grant_type: 'client_credentials',
                client_key: key,
                client_secret: secret,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });
        return await r.json();
    }
}
