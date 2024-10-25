import React, { MouseEventHandler, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { Auth } from "../../utils/auth/auth";
import { RedirectRequest } from "@azure/msal-browser";
import {
    Avatar,
    makeStyles,
    MenuItem,
    MenuList,
    Popover,
    PopoverSurface,
    PopoverTrigger,
    Tooltip,
} from "@fluentui/react-components";
import resolveConfig from "tailwindcss/resolveConfig";
import TailwindConfig from "../../../tailwind.config";
import { isPlatformAdmin } from "../../utils/auth/roles";

const fullConfig = resolveConfig(TailwindConfig);
const useStylesAvatar = makeStyles({
    root: {
        [`@media (min-width: ${(fullConfig?.theme?.screens as Record<string, string>)["md"]})`]: {
            display: "inherit",
            "margin-left": "4px",
            "background-color": "#004E8C",
            color: "#FFFFFF",
        },
        display: "none",
    },
});

export enum NavLocation {
    Home = 1,
    Contribute = 2,
    PersonalDocs = 3,
}

interface NavItem {
    key: string;
    label: string;
    isPrimary: boolean;
    location?: NavLocation;
    to?: string;
    action?: MouseEventHandler;
    target?: string;
    externalNav?: string;
}

export function HeaderBar({ location }: { location?: NavLocation }) {
    const { t } = useTranslation();
    const [openDrawer, setOpenDrawer] = useState(false);
    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const stylesAvatar = useStylesAvatar();

    const linkClasses = "cursor-pointer hover:no-underline hover:border-b-[3px] h-9 min-h-0 block text-white";
    const linkCurrent = "pointer-events-none border-b-[3px]";
    const isAuthenticated = accounts.length > 0;
    const isAdmin = isPlatformAdmin(accounts);

    const navItems: (NavItem | null)[] = useMemo(
        () => [
            // {
            //     key: "home",
            //     label: t("components.header-bar.home"),
            //     isPrimary: true,
            //     location: NavLocation.Home,
            //     to: "/",
            // },
            // !isAuthenticated
            //     ? {
            //           key: "sign-in",
            //           label: t("components.header-bar.sign-in"),
            //           isPrimary: true,
            //           action: signIn,
            //       }
            //     : null,
            isAuthenticated
                ? {
                      key: "sign-out",
                      label: t("components.header-bar.sign-out"),
                      isPrimary: false,
                      action: signOut,
                  }
                : null,
            isAuthenticated
                ? {
                      key: "personalDocuments",
                      label: "Personal Documents",
                      isPrimary: false,
                      location: NavLocation.PersonalDocs,
                      to: "/personalDocuments",
                  }
                : null,
        ],
        [accounts]
    );

    function toggleMenu() {
        setOpenDrawer((openDrawer) => !openDrawer);
    }

    function signIn() {
        instance.loginRedirect(Auth.getAuthenticationRequest() as RedirectRequest);
    }

    function signOut() {
        instance.logoutRedirect();
    }

    function renderLink(nav: NavItem, className?: string) {
        return (
            <li key={nav.key} className={className}>
                {nav.externalNav ? (
                    <a href={nav.externalNav} target={nav.target}>
                        {nav.label}
                    </a>
                ) : nav.to ? (
                    <Link
                        className={`${linkClasses} ${nav.location && location === nav.location ? linkCurrent : ""}`}
                        to={nav.to}
                        target={nav.target}
                    >
                        {nav.label}
                    </Link>
                ) : (
                    <span role="link" tabIndex={0} className={linkClasses} onClick={nav.action}>
                        {nav.label}
                    </span>
                )}
            </li>
        );
    }

    return (
        <>
            <div className="flex mr-20 ml-20 justify-between">
                <div className="flex justify-between gap-3">
                    <img className="my-auto" src="/img/Contoso_Logo_sm.png" alt="logo" />  
                    <div className="my-auto pb-3 text-lg font-semibold leading-tight text-white mt-3">
                        {t("components.header-bar.title")}
                    </div>
                    <div className="border border-zinc-500"></div>
                    
                    <div className="order-5 my-auto pb-3 text-lg font-semibold leading-tight text-white mt-3">
                        {t("components.header-bar.sub-title")}
                    </div>
                </div>
 
                <nav className="whitespace-nowrap text-lg font-semibold leading-10">
                    <ul
                        className={
                            (openDrawer ? "h-auto w-auto " : "hidden ") +
                            "fixed right-0 z-50 my-auto bg-white px-6 pb-6 pt-12 shadow-md md:relative md:flex md:flex-row md:space-x-3 md:bg-transparent md:p-0 md:pt-0.5 md:shadow-none lg:space-x-10"
                        }
                    >
                        {/* Close button - Small sizes only */}
                        <li className="z-90 absolute right-6 top-0 md:hidden">
                            <button
                                className="cursor-pointer text-right text-3xl hover:no-underline"
                                onClick={toggleMenu}
                            >
                                &times;
                            </button>
                        </li>

                        {/* Primary nav items */}
                        {(navItems.filter((o) => o && o.isPrimary) as NavItem[]).map((nav) => renderLink(nav))}

                        {/* Only visible on small screens  */}
                        {(navItems.filter((o) => o && !o.isPrimary) as NavItem[]).map((nav) =>
                            renderLink(nav, "md:hidden")
                        )}

                        {/* User Avatar - Only visible on md screens */}
                        {isAuthenticated && (
                            <li className="flex items-end">
                                {/* The popover offers an arrow and the Menu doesn't that's why we only use a MenuList */}
                                <Popover withArrow positioning="below">
                                    <PopoverTrigger disableButtonEnhancement>
                                        <Tooltip content={accounts[0].name || ""} relationship="label">
                                            <Avatar className={stylesAvatar.root} name={accounts[0].name} />
                                        </Tooltip>
                                    </PopoverTrigger>
                                    <PopoverSurface>
                                        <div className="-m-4">
                                            <MenuList>
                                                {(navItems.filter((o) => o && !o.isPrimary) as NavItem[]).map((nav) => (
                                                    <MenuItem
                                                        key={nav.key}
                                                        onClick={nav.to ? () => navigate(nav.to as string) : nav.action}
                                                    >
                                                        {nav.label}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </div>
                                    </PopoverSurface>
                                </Popover>
                            </li>
                        )}
                    </ul>

                    {/* Hamburger icon - only for small screens */}
                    <div className="flex items-center text-2xl md:hidden">
                        <button onClick={toggleMenu}>&#9776;</button>
                    </div>
                </nav>
            </div>
        </>
    );
}
