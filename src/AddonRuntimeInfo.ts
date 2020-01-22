import { ITokenInfo } from "./ITokenInfo";

export interface ISettings {
    [key: string]: string;
}

export class AddonRuntimeInfo {
    /**
     * Gets or sets the category.
     *
     * @type {string}
     * @memberof AddonRuntimeInfo
     */
    public category!: string;

    /**
     * Gets or sets the localized description.
     *
     * @type {string}
     * @memberof AddonRuntimeInfo
     */
    public description!: string;

    /**
     *
     *
     * @type {("Canvas" | "Panel")}
     * @memberof AddonRuntimeInfo
     */
    public host!: "Canvas" | "Panel";

    /**
     * Material icon name (url or an AppAction)
     *
     * @type {string}
     * @memberof ManifestHosts
     */
    public icon!: string;

    /**
     * Material icon name to be used in dark mode (optional)
     *
     * @type {string}
     * @memberof ManifestHosts
     */
    public iconDark?: string;
    /**
     * Gets or sets the addon identifier.
     *
     * @type {string}
     * @memberof AddonRuntimeInfo
     */
    public identifier!: string;

    /**
     * Defines the addon behavior when it becomes inactive
     * where it can become hidden (default behavior) or
     * switch to mini mode 200px width (eg. call screen).
     *
     * @type {AddonInactiveMode}
     * @memberof AddonRuntimeInfo
     */
    public inactiveMode: 'hidden' | 'mini' = 'hidden';

    /**
     * Gets or sets the value determining if addon should be preloaded on meet initialization.
     * If <c>false</c> addon will be loaded only on navigation to its workspace
     *
     * @type {boolean}
     * @memberof AddonRuntimeInfo
     */
    public preloaded!: boolean;

    /**
     * Gets or sets the hashed identifier of the meeting/interview aka "session"
     *
     * @type {string}
     * @memberof AddonRuntimeInfo
     */
    public sessionId!: string;

    /**
     * Gets or sets the hashed identifier containing session and user identity values.
     *
     * @type {string}
     * @memberof AddonRuntimeInfo
     */
    public sessionUserId!: string;

    /**
     * Gets or sets the role user has in a given session.
     *
     * @type {string}
     * @memberof AddonRuntimeInfo
     */
    public sessionUserRole!: string;

    /**
     * Gets or sets a collection of zero or more addon runtime settings
     * which addon author defined to be passed to addon
     *
     * @type {ISettings}
     * @memberof AddonRuntimeInfo
     */
    public settings!: ISettings;

    /**
     * Gets or sets the hashed tenant identifier.
     *
     * @type {string}
     * @memberof AddonRuntimeInfo
     */
    public tenant!: string;

    /**
     * Gets or sets the localized addon title.
     *
     * @type {string}
     * @memberof AddonRuntimeInfo
     */
    public title!: string;

    /**
     * Gets or sets the token
     *
     * @type {ITokenInfo}
     * @memberof AddonRuntimeInfo
     */
    public token!: ITokenInfo;

    /**
     * Gets or sets the info if the user is a guest user.
     *
     * @type {boolean}
     * @memberof AddonRuntimeInfo
     */
    public isGuestUser!: boolean;
}
