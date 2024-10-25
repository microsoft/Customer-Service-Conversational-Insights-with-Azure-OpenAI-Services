import { AccountInfo } from "@azure/msal-browser";
import { AppRoles } from "../../types/appRoles";

export function isPlatformAdmin(accounts: AccountInfo[]): boolean {
    return checkRole(accounts, AppRoles.PlatformAdmin);
}

function checkRole(accounts: AccountInfo[], role: string): boolean {
    return (
        accounts.length > 0 &&
        (accounts[0].idTokenClaims?.roles || false) &&
        accounts[0].idTokenClaims.roles.includes(role)
    );
}

function isLoggedIn(accounts: AccountInfo[]): boolean {
    return accounts.length > 0 && accounts[0].idTokenClaims != undefined;
}

export function getActiveUser(accounts: AccountInfo[]): AccountInfo | undefined {
    if (accounts.length > 0) {
        return accounts[0];
    }
    return undefined;
}


