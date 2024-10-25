import {
    BrowserAuthError,
    LogLevel,
    PopupRequest,
    RedirectRequest,
    SsoSilentRequest,
    EventType,
    InteractionType,
    PublicClientApplication,
    EventCallbackFunction,
    InteractionRequiredAuthError,
    AccountInfo,
    Configuration,
} from "@azure/msal-browser";
import { AuthenticationResult } from "@azure/msal-common";

export interface B2cPolicy {
    name: string;
    authority: string;
}

export interface B2cPolicies {
    signUpSignIn: B2cPolicy;
    forgotPassword: B2cPolicy;
    editProfile: B2cPolicy;
}

export interface Resources {
    [key: string]: Resource;
}

export interface Resource {
    endpoint: string;
    scopes: string[];
}

export class Auth {
    public static msalInstance: PublicClientApplication;
    public static resources: Resources;

    /**
     * Setups App MSAL instance.
     * @param {string} clientId             App clientId.
     * @param {string} authority            URI of the tenant to authenticate and authorize with (instance + tenantid).
     * @param {string[]} knownAuthorities   Array of URIs that are known to be valid. Used in B2C scenarios.
     * @param {'sessionStorage'|'localStorage'} cacheLocation Cache location. 'sessionStorage' is more secure, but 'localStorage' gives you SSO between tabs.
     * @param {Resources} resources         Protected resources.
     * @param {B2cPolicies} b2cPolicies     The B2C policies.
     * @returns {any} MSAL instance
     */
    public static initAuth(
        clientId: string,
        authority: string,
        knownAuthorities: string[],
        cacheLocation: "sessionStorage" | "localStorage",
        resources: Resources,
        b2cPolicies?: B2cPolicies
    ): PublicClientApplication {
        Auth.resources = resources;

        const config = this.msalConfig(clientId, authority, knownAuthorities, cacheLocation);

        Auth.msalInstance = new PublicClientApplication(config);
        Auth.msalInstance.addEventCallback(this.msalEventCallbackFactory(Auth.msalInstance, b2cPolicies));
        /* Since the event callback is added in the bootstrap outside a component we don't need to remove it on unmount
         * if (callbackId) { instance.removeEventCallback(callbackId); } */

        const accounts = Auth.msalInstance.getAllAccounts();
        if (accounts.length > 0) Auth.postLogin(accounts[0]);

        return Auth.msalInstance;
    }

    /**
     * Gets an access token to call the specified protected resource.
     * @param {string="api"} resourceName The resource to get access token to access.
     * @returns {any} Access token.
     */
    public static async getAccessTokenAsync(resourceName = "api"): Promise<string | null> {
        if (!Auth.msalInstance || !Auth.resources)
            throw Error("getAccessTokenAsync: No PublicClientApplication found.");

        // We could also get the account by reading Auth.msalInstance.getAllAccounts()[0];
        const account = Auth.msalInstance.getActiveAccount();
        if (!account)
            throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");

        let response: AuthenticationResult | undefined = undefined;
        try {
            response = await Auth.msalInstance.acquireTokenSilent({
                scopes: (Auth.resources[resourceName] as Resource).scopes,
                account: account,
            });
        } catch (error) {
            console.error("acquireTokenSilent:", error);
            if (error instanceof InteractionRequiredAuthError || error instanceof BrowserAuthError) {
                // We could also do response = await Auth.msalInstance.acquireTokenPopup
                await Auth.msalInstance.acquireTokenRedirect(Auth.getAuthenticationRequest() as RedirectRequest);
                return null;
            }
        }
        if (!response) return null;
        return response.accessToken;
    }

    public static getAuthenticationRequest(resourceName = "api"): PopupRequest | RedirectRequest | SsoSilentRequest {
        const request: PopupRequest | RedirectRequest | SsoSilentRequest = {
            scopes: (Auth.resources[resourceName] as Resource).scopes,
            extraQueryParameters: {},
        };
        // if (Auth.domainHint) request.extraQueryParameters!.domain_hint = Auth.domainHint;
        return request;
    }

    /**
     * Logout active user from B2C.
     */
    public static logout(): void {
        Auth.postLogout();

        // There is a reported issue with this function
        // msal.js.browser@2.22.0 : Error - Attempted to clear all MSAL cache items and failed. Local cache unchanged.
        // https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/4564
        Auth.msalInstance.logoutRedirect({ postLogoutRedirectUri: "/" });
    }

    /**
     * Configuration object to be passed to MSAL instance on creation.
     * For a full list of MSAL.js configuration parameters, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
     */
    private static msalConfig(
        clientId: string,
        authority: string,
        knownAuthorities: string[],
        cacheLocation: "sessionStorage" | "localStorage"
    ): Configuration {
        return {
            auth: {
                clientId: clientId, // This is the ONLY mandatory field that you need to supply.
                authority: authority, // URI of the tenant to authenticate and authorize with.
                knownAuthorities: knownAuthorities, // An array of URIs that are known to be valid. Used in B2C scenarios.
                redirectUri: "/", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
                postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
                navigateToLoginRequestUrl: true, // If 'true', will navigate back to the original request location before processing the auth code response.
            },
            cache: {
                cacheLocation: cacheLocation, // Configures cache location. 'sessionStorage' is more secure, but 'localStorage' gives you SSO between tabs.
                storeAuthStateInCookie: false, // Set this to 'true' if you are having issues on IE11 or Edge
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
                        if (containsPii) {
                            return;
                        }
                        switch (level) {
                            case LogLevel.Error:
                                console.error(message);
                                return;
                            case LogLevel.Warning:
                                console.warn(message);
                                return;
                            case LogLevel.Info:
                                // console.info(message);
                                return;
                            case LogLevel.Verbose:
                                // console.debug(message);
                                return;
                        }
                    },
                    piiLoggingEnabled: false,
                },
                iframeHashTimeout: 10000,
            },
        };
    }

    /**
     * Gets the event call back to deal with authorization events.
     * @param {PublicClientApplication} instance The msal instance.
     * @param {B2cPolicies} b2cPolicies The B2C policies.
     * @returns {any} Event callback to attach as msalInstance.addEventCallback()
     */
    private static msalEventCallbackFactory(
        instance: PublicClientApplication,
        b2cPolicies?: B2cPolicies
    ): EventCallbackFunction {
        return (
            event: any // eslint-disable-line
        ) => {
            if (event.eventType === EventType.LOGIN_FAILURE) {
                if (event.error && event.error.errorMessage.indexOf("AADB2C90118") > -1) {
                    if (event.interactionType === InteractionType.Redirect) {
                        instance.loginRedirect({
                            authority: b2cPolicies?.forgotPassword.authority,
                            scopes: [],
                        });
                    } else if (event.interactionType === InteractionType.Popup) {
                        instance
                            .loginPopup({
                                authority: b2cPolicies?.forgotPassword.authority,
                                scopes: [],
                            })
                            .catch((_e) => {
                                return;
                            });
                    }
                }
                // {PLCOM002000004} : error code from DCC Auth API, Incase user does not exist.
                else if (event.error && event.error.errorMessage.indexOf("PLCOM002000004") > -1) {
                    throw Error("User not recognized.");
                }
            }

            if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
                if (b2cPolicies && event?.payload) {
                    /**
                     * We need to reject id tokens that were not issued with the default sign-in policy.
                     * 'acr' claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use 'tfp' instead of 'acr').
                     * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
                     */
                    if (event.payload.idTokenClaims["acr"] === b2cPolicies?.forgotPassword.name) {
                        window.alert("Password has been reset successfully. \nPlease sign-in with your new password.");
                        return instance.logoutRedirect();
                    } else if (event.payload.idTokenClaims["acr"] === b2cPolicies?.editProfile.name) {
                        window.alert("Profile has been edited successfully. \nPlease sign-in again.");
                        return instance.logoutRedirect();
                    }
                }
            }

            if (event.eventType === EventType.LOGIN_SUCCESS && event?.payload.account) {
                Auth.postLogin(event.payload.account);
            }
        };
    }

    private static postLogin(account: AccountInfo): void {
        Auth.msalInstance.setActiveAccount(account);
    }

    private static postLogout(): void {
        Auth.msalInstance.setActiveAccount(null);
    }
}
