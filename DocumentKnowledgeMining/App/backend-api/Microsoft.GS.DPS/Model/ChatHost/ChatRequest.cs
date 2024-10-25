using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Model.ChatHost
{
    public class ChatRequest
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string ChatSessionId { get; set; }
        public string Question { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string[] DocumentIds { get; set; }
    }

    public class ChatRequestValidator : AbstractValidator<ChatRequest>
    {
        public ChatRequestValidator()
        {
            RuleFor(x => x.Question)
                .NotNull()
                .NotEmpty();
        }
    }

}
