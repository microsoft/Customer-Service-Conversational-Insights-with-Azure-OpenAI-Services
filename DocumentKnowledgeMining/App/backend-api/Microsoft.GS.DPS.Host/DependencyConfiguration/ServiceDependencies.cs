using Microsoft.GS.DPSHost.API;
using Microsoft.KernelMemory;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.Extensions.Options;
using Microsoft.GS.DPS.API;
using Microsoft.GS.DPS.Storage.ChatSessions;
using Microsoft.GS.DPS.Storage.Document;
using MongoDB.Driver;
using FluentValidation;
using Microsoft.GS.DPS.Model.UserInterface;
using Microsoft.GS.DPS.Storage.AISearch;
using Microsoft.GS.DPSHost.AppConfiguration;
using Microsoft.Extensions.DependencyInjection;

namespace Microsoft.GS.DPSHost.ServiceConfiguration
{
    public class ServiceDependencies
    {
        public static void Inject(IHostApplicationBuilder builder)
        {
            builder.Services
                .AddValidatorsFromAssemblyContaining<PagingRequestValidator>()
                .AddSingleton<Microsoft.GS.DPS.API.KernelMemory>()
                .AddSingleton<Microsoft.GS.DPS.API.ChatHost>()
                .AddSingleton<Microsoft.GS.DPS.API.UserInterface.Documents>()
                .AddSingleton<Microsoft.GS.DPS.API.UserInterface.DataCacheManager>()
                .AddSingleton<Microsoft.SemanticKernel.Kernel>(x =>
                {
                    var aiService = x.GetRequiredService<IOptions<AIServices>>().Value;
                    return Kernel.CreateBuilder()
                                 .AddAzureOpenAIChatCompletion(deploymentName: builder.Configuration.GetSection("Application:AIServices:GPT-4o-mini")["ModelName"] ?? "",
                                                              endpoint: builder.Configuration.GetSection("Application:AIServices:GPT-4o-mini")["Endpoint"] ?? "",
                                                              apiKey: builder.Configuration.GetSection("Application:AIServices:GPT-4o-mini")["Key"] ?? "")

                                 .Build();
                })
                .AddSingleton<ChatSessionRepository>(x =>
                {
                    var services = x.GetRequiredService<IOptions<Services>>().Value;

                    return new ChatSessionRepository(
                                                new MongoClient(services.PersistentStorage.CosmosMongo.ConnectionString ?? "")
                                                                        .GetDatabase(services.PersistentStorage.CosmosMongo.Collections.ChatHistory.Database ?? ""),
                                                                                        collectionName: services.PersistentStorage.CosmosMongo.Collections.ChatHistory.Collection ?? ""

                                                   );
                })
                .AddSingleton<DocumentRepository>(x =>
                {
                    var services = x.GetRequiredService<IOptions<Services>>().Value;
                    return new DocumentRepository(
                                                new MongoClient(services.PersistentStorage.CosmosMongo.ConnectionString ?? "")
                                                                        .GetDatabase(services.PersistentStorage.CosmosMongo.Collections.DocumentManager.Database ?? ""),
                                                                                    collectionName: services.PersistentStorage.CosmosMongo.Collections.DocumentManager.Collection ?? ""
                                                   );


                })
                .AddSingleton<MemoryWebClient>(x =>
                {
                    var services = x.GetRequiredService<IOptions<Services>>().Value;
                    return new MemoryWebClient(endpoint: services.KernelMemory.Endpoint ?? "", new HttpClient() { Timeout = new TimeSpan(0, 60, 0) });

                })
                .AddSingleton<TagUpdater>(x =>
                {
                    var services = x.GetRequiredService<IOptions<Services>>().Value;
                    return new TagUpdater(services.AzureAISearch.Endpoint, services.AzureAISearch.APIKey);

                })

                ;
        }
    }
}
