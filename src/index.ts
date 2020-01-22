import { TokenService } from "./services/TokenService";

import AddonsSdk, { InitMessage, AddonMode, PredefinedMeetingState, MessageType } from "meet-addons-sdk";

export class Index {
    
    constructor() {

        console.log("[MEET-DEVTOOLS]:: ctor");
        
        const host = localStorage.getItem("meet-dev-sdk-host");
        const addonIdentifier = localStorage.getItem("meet-dev-sdk-addon-id");
        if (!host || !addonIdentifier ) {
            return Promise.reject("To use token service please define in local storage meet-dev-sdk-host and meet-dev-sdk-addon-id");
        } 

        const tokenService = new TokenService()
        tokenService.getTenantTokenAsync()
            .then(tenantToken => tokenService.getSessionTokenAsync(tenantToken.access_token))
            .then(sessionToken => tokenService.getAddonRuntimeInfoAsync(sessionToken.access_token))
            .then(addonRuntimeInfo => {
                const msg: InitMessage = {
                    configuration: [],
                    mode: AddonMode.NORMAL,
                    participants: [],
                    host: {
                        authHost: host,
                        origin: host
                    },
                    principal: {
                        addonIdentifier: addonIdentifier,
                        color: "#303F9F",
                        displayName: `FirstName LastName`,
                        isGuest: false,
                        sessionId: addonRuntimeInfo.sessionId,
                        sessionUserId: addonRuntimeInfo.sessionUserId,
                        sessionUserRole: addonRuntimeInfo.sessionUserRole,
                        tenant: addonRuntimeInfo.tenant,
                        theme: "dark",
                        token: {
                            value: addonRuntimeInfo.token.access_token,
                            expireAt: addonRuntimeInfo.token.expires_at,
                        },
                    },
                    settings: addonRuntimeInfo.settings,
                    state: PredefinedMeetingState.MEETING_STARTED,
                    type: MessageType.INIT,
                }
                
                console.log("[MEET-DEVTOOLS]::Index initSdk", msg);
                AddonsSdk.onInit(msg)

            })
    }
}

new Index();