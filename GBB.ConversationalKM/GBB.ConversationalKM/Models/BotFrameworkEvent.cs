using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace GBB.ConversationalKM
{

    public class BotFrameworkEvent
    {
        public Event[] @event { get; set; }
        public Internal @internal { get; set; }
        public Context context { get; set; }
    }

    public class Internal
    {
        public Data data { get; set; }
    }

    public class Data
    {
        public string id { get; set; }
        public string documentVersion { get; set; }
    }

    public class Context
    {
        public Application application { get; set; }
        public Data1 data { get; set; }
        public Cloud cloud { get; set; }
        public Device device { get; set; }
        public User user { get; set; }
        public Session session { get; set; }
        public Operation operation { get; set; }
        public Location location { get; set; }
        public Custom custom { get; set; }
    }

    public class Application
    {
        public string version { get; set; }
    }

    public class Data1
    {
        public DateTime eventTime { get; set; }
        public bool isSynthetic { get; set; }
        public float samplingRate { get; set; }
    }

    public class Cloud
    {
    }

    public class Device
    {
        public string type { get; set; }
        public string roleInstance { get; set; }
        public Screenresolution screenResolution { get; set; }
    }

    public class Screenresolution
    {
    }

    public class User
    {
        public string anonId { get; set; }
        public bool isAuthenticated { get; set; }
    }

    public class Session
    {
        public string id { get; set; }
        public bool isFirst { get; set; }
    }

    public class Operation
    {
        public string id { get; set; }
        public string parentId { get; set; }
        public string name { get; set; }
    }

    public class Location
    {
        public string clientip { get; set; }
    }

    public class Custom
    {
        public JObject[] dimensions { get; set; }
    }

    public class Dimension
    {
        public string channelId { get; set; }
        public string activityId { get; set; }
        public string AspNetCoreEnvironment { get; set; }
        public string recipientId { get; set; }
        public string locale { get; set; }
        public string activityType { get; set; }
        public string recipientName { get; set; }
        public string fromId { get; set; }
        public string text { get; set; }
        public string DeveloperMode { get; set; }
        public string fromName { get; set; }
    }

    public class Event
    {
        public string name { get; set; }
        public int count { get; set; }
    }

}
