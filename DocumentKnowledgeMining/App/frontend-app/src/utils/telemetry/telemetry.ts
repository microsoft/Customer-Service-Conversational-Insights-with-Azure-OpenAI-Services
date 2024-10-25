import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

export class Telemetry {
    public static reactPlugin: ReactPlugin;
    public static appInsights: ApplicationInsights;

    public static initAppInsights(connectionString: string, autostart: boolean): ReactPlugin {
        Telemetry.reactPlugin = new ReactPlugin();
        Telemetry.appInsights = new ApplicationInsights({
            config: {
                connectionString: connectionString,
                enableAutoRouteTracking: true,
                // extensions: [Telemetry.reactPlugin],
                disableTelemetry: !autostart,
            },
        });
        Telemetry.appInsights.loadAppInsights();
        return Telemetry.reactPlugin;
    }

    public static disableAppInsights(): void {
        Telemetry.appInsights.config.disableTelemetry = true;
        Telemetry.reactPlugin.getCookieMgr().purge("ai_user");
        Telemetry.reactPlugin.getCookieMgr().purge("ai_session");
    }

    public static enableAppInsights(): void {
        Telemetry.appInsights.config.disableTelemetry = false;
    }
}
