using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Model.ChatHost
{
    public class Answer
    {
        public string Response { get; set; }
        public string[] Followings { get; set; }
        public string[] Keywords { get; set; }
    }
}
