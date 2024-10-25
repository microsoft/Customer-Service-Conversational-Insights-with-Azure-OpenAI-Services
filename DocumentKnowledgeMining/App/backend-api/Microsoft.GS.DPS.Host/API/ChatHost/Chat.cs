using Microsoft.GS.DPS.Model.ChatHost;
using Microsoft.GS.DPS.API;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Text;
using System.Text.Json;

namespace Microsoft.GS.DPSHost.API
{
    public class Chat
    {
        public static void AddAPIs(WebApplication app)
        {
            //RegisterAsync the chat API
            app.MapPost("/chat", async (ChatRequest request,
                                        ChatRequestValidator validator,
                                        ChatHost chatHost) =>
            {
                if(validator.Validate(request).IsValid == false)
                {
                    return Results.BadRequest();
                }

                var result = await chatHost.Chat(request);
                return Results.Ok<ChatResponse>(result);

            })
            .DisableAntiforgery();


            ///<summary>
            //RegisterAsync the chat API
            //</summary>
            app.MapPost("/chatAsync", async (HttpContext ctx, 
                                             ChatRequest request, 
                                             ChatRequestValidator validator,
                                             ChatHost chatHost) =>
            {
                if (validator.Validate(request).IsValid == false)
                {
                    return Results.BadRequest();
                }

                ctx.Response.ContentType = "text/plain";

                //Make a response as a stream
                var result = chatHost.ChatAsync(request).Result;

                //Create a dynamic object to store the response
                var response = new
                {
                    result.ChatSessionId,
                    result.DocumentIds,
                    result.SuggestingQuestions
                };

                //Add the response to the header
                ctx.Response.Headers.Add("RESPONSE", JsonSerializer.Serialize(response));

                // Stream the response
                await foreach (var word in result.AnswerWords)
                {
                    await ctx.Response.WriteAsync(word);
                    await ctx.Response.WriteAsync(" ");
                }
                return Results.Ok();
            })
            .DisableAntiforgery();
        }
    }
}
