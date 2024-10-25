import React from "react";
import ReactDOM from "react-dom/client";
import { initializeLanguage } from "./utils/i18n/i18n";
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import App from "./App";
import "./index.scss";
import { AppContextProvider } from "./AppContext";

declare global {
    interface Window {
        ENV: any; // eslint-disable-line @typescript-eslint/no-explicit-any
        WcpConsent: any; // eslint-disable-line @typescript-eslint/no-explicit-any
        
    }
}

initializeLanguage();
initializeFileTypeIcons();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <AppContextProvider>
        <App />
    </AppContextProvider>
    // </React.StrictMode>
);
