import React from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { Footer } from "../footer/footer";

export function Layout({ children }: { children?: React.ReactNode }) {
    const { inProgress } = useMsal();

    return !inProgress || inProgress === InteractionStatus.None ? (
        <>            
            {children}
        </>
    ) : null;
}
