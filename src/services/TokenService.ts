import { ITokenInfo } from "./ITokenInfo";
import { AddonRuntimeInfo } from "./AddonRuntimeInfo";
import { IMeeting } from "./IMeeting";
import { IEvent } from "./IEvent";

import {ISessionTokenInfo} from "./ISessionTokenInfo";

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
            return Promise.reject("[Meet|DevTools]:To use token service please define in local storage meet-dev-sdk-host and meet-dev-sdk-addon-id");
        } 

        const r = await fetch(`${host}/meetingAddons/${addonIdentifier}`, {
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
     * @param {string} addonIdentifier Id of the addon which should be part of meet config for which session token is returned.
     * @returns {Promise<ITokenInfo>}
     * @memberof TokenService
     */
    public getSessionTokenAsync = async (tenantToken: string, addonIdentifier: string) : Promise<ISessionTokenInfo> => {

        const host = localStorage.getItem("meet-dev-sdk-host");
       if (!host) {
            return Promise.reject("[Meet|DevTools]:To use token service please define in local storage meet-dev-sdk-host, meet-dev-sdk-key and meet-dev-sdk-secret");
        } 

        const resourceType = parseInt(localStorage.getItem("meet-dev-sdk-type") || '1');
        let resourceId: string;

        switch (resourceType) {
            case 1: // meet
                resourceId = await this.createMeetingAsync(addonIdentifier, tenantToken);
                break;
            case 2: // event
                const meetCode = await this.createMeetingAsync(addonIdentifier, tenantToken);
                resourceId = await this.createEventAsync(meetCode, tenantToken);
                break;
        }

        const token = await fetch(`${host}/token/session/${resourceId}/${resourceType}`, {
            headers: {
                "Authorization": `bearer ${tenantToken}`,
                "Content-Type": "application/json",
            },
            method: "GET",
        });

        const tokenInfo = await token.json();
        return Promise.resolve<ISessionTokenInfo>({
            token: tokenInfo,
            resourceType,
            resourceId
        });
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
            return Promise.reject("[Meet|DevTools]:To use token service please define in local storage meet-dev-sdk-host, meet-dev-sdk-key and meet-dev-sdk-secret");
        } 

        const r = await fetch(`${host}/token`, {
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

        if (r.ok)  {
            return await r.json();
        } else {
            return Promise.reject("[Meet|DevTools]:Invalid credentials meet-dev-sdk-host, meet-dev-sdk-key and meet-dev-sdk-secret");
        }
    }

    private createMeetingAsync = async (addonIdentifier: string, tenantToken: string): Promise<string> => {
        const host = localStorage.getItem("meet-dev-sdk-host");
        const meetCode = localStorage.getItem("meet-dev-sdk-code");

        const request = {
            code: meetCode,
            addonsInfo: [
                {
                    identifier: addonIdentifier,
                }
            ]
        };

        if (!meetCode) {
            delete request.code
        }

        const r = await fetch(`${host}/meetings`, {
            body: JSON.stringify(request),
            headers: {
                "Authorization": `bearer ${tenantToken}`,
                "Content-Type": "application/json",
            },
            method: "POST",
        });
        
        const meet: IMeeting = await r.json();
        localStorage.setItem("meet-dev-sdk-code", meet.code);

        return meet.code;
    }
    
    private createEventAsync = async (meetCode: string, tenantToken: string): Promise<string> => {
        const host = localStorage.getItem("meet-dev-sdk-host");

        const request = {
            notifyParticipants: false,
            title: 'Test event for meet:' + meetCode,
            description: 'Description of the test event',
            resolutionMode: 'fifo',
            originId: meetCode,
            participants: [
                {
                    email: "test-proposer@meet.rs",
                    firstName: "Test",
                    lastName: "Proposer",
                    role: "PowerUser",
                    order: 0,
                },
                {
                    email: "test-selector@meet.rs",
                    firstName: "Test",
                    lastName: "Selector",
                    role: "User",
                    order: 1,
                },
                {
                    email: "test-admin@meet.rs",
                    firstName: "Test",
                    lastName: "Admin",
                    role: "Admin",
                    order: 2,

                },
            ]
        };

        const r = await fetch(`${host}/events`, {
            body: JSON.stringify(request),
            headers: {
                "Authorization": `bearer ${tenantToken}`,
                "Content-Type": "application/json",
            },
            method: "POST",
        });
        
        const event: IEvent = await r.json();
        return event.code;
    }
}
