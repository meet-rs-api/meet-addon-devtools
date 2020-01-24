import { TokenService } from "./services/TokenService";

import { InitMessage, AddonMode, PredefinedMeetingState, MessageType } from "meet-addons-sdk";

const index = async () => {
    console.log("[MEET-DEVTOOLS]:: ctor");
        
    const host = localStorage.getItem("meet-dev-sdk-host");
    const addonIdentifier = localStorage.getItem("meet-dev-sdk-addon-id");
    if (!host || !addonIdentifier ) {
        return Promise.reject("To use token service please define in local storage meet-dev-sdk-host and meet-dev-sdk-addon-id");
    } 

    const tokenService = new TokenService();
    const tenantToken = await tokenService.getTenantTokenAsync();
    const sessionToken = await tokenService.getSessionTokenAsync(tenantToken.access_token, addonIdentifier);

    const w = window as any;
    if (w.vivani) {
        w.vivani.token = w.vivani.token || sessionToken;

        if (w.vivani.sdk) {
            const addonRuntimeInfo = await tokenService.getAddonRuntimeInfoAsync(sessionToken.access_token);
            const msg: InitMessage = {
                configuration: [],
                mode: AddonMode.NORMAL,
                participants: [],
                host: {
                    authHost: host.replace("/v1", ""),
                    origin: host.replace("/v1", "")
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
                    token: addonRuntimeInfo.token,
                },
                settings: addonRuntimeInfo.settings,
                state: PredefinedMeetingState.MEETING_STARTED,
                type: MessageType.INIT,
            };
            console.log("[MEET-DEVTOOLS] --> AddonsSdk.onInit", w.vivani);
            w.vivani.sdk.onInit(msg);
        }
    }
}

index().then(() =>"[Meet-DevTools]::initialized");