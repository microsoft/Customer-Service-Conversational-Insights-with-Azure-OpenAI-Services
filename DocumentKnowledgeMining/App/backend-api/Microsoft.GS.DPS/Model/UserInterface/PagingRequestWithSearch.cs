using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Model.UserInterface
{
    public class PagingRequestWithSearch : PagingRequest
    {
        [JsonPropertyOrder(4)]
        public Dictionary<string,string> Tags { get; set; }
        [JsonPropertyOrder(3)]
        public string Keyword { get; set; }
    }

    public class PagingRequestWithSearchValidator : AbstractValidator<PagingRequestWithSearch>
    {
        public PagingRequestWithSearchValidator()
        {

            RuleFor(x => x.PageNumber)
              .NotNull()
              .NotEmpty()
              .GreaterThan(0);

            RuleFor(x => x.PageSize)
                .NotNull()
                .NotEmpty()
                .GreaterThan(0);

            //Once StartDate and EndDate exist, StartDate can not be older than EndDate
            //If EndDate exist, StartDate should be mandatory
            RuleFor(x => x.StartDate)
                .LessThanOrEqualTo(x => x.EndDate)
                .When(x => x.StartDate.HasValue && x.EndDate.HasValue)
                .WithMessage("Start Date cannot be later than End Date");


            // StartDate should not be empty when EndDate is provided
            RuleFor(x => x.StartDate)
                .NotEmpty()
                .When(x => x.EndDate.HasValue)
                .WithMessage("Start Date cannot be empty when End Date is provided");
        }
    }
}
