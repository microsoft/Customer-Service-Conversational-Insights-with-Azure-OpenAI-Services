using System.Diagnostics;

namespace Microsoft.GS.DPSHost.API 
{ 
    public class Operation
    {
        public static void AddAPIs(WebApplication app)
        {
            //display running up time so far
            app.MapGet("/", static () => $"DPS API Services Uptime so far: {DateTime.Now - Process.GetCurrentProcess().StartTime}");
        }
    }
}
