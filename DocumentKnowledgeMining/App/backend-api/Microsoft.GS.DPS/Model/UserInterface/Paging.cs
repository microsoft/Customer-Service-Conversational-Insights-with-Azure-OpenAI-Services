using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using FluentValidation;

namespace Microsoft.GS.DPS.Model.UserInterface
{
    public class PagingRequest
    {
        [JsonPropertyOrder(1)]
        public int PageNumber { get; set; }
        [JsonPropertyOrder(2)]
        public int PageSize { get; set; }
        [JsonPropertyOrder(5)]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public DateTime? StartDate { get; set; }
        [JsonPropertyOrder(6)]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public DateTime? EndDate { get; set; }
    }

    public class PagingRequestValidator : AbstractValidator<PagingRequest>
    {
        public PagingRequestValidator()
        {
            RuleFor(x => x.PageNumber)
                .NotNull()
                .NotEmpty()
                .GreaterThan(0);

            RuleFor(x => x.PageSize)
                .NotNull()
                .NotEmpty()
                .GreaterThan(0);

        }
    }

}
