// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Driver.Core.Configuration;
using MongoDB.Driver.Linq;

namespace Microsoft.GS.DPS.Storage.Components
{
    public class MongoEntntyCollectionBase<TEntity, TIdentifier> : IDataRepositoryProvider<TEntity, TIdentifier>
          where TEntity : class, IEntityModel<TIdentifier>
    {
        public IRepository<TEntity, TIdentifier> EntityCollection { get; init; }

        public MongoEntntyCollectionBase(string DataConnectionString, string CollectionName)
        {
            CosmosMongoClientManager.DataconnectionString = DataConnectionString;
            MongoClient _client = CosmosMongoClientManager.Instance;

            this.EntityCollection =
                new BusinessTransactionRepository<TEntity, TIdentifier>(_client,
                CollectionName);

        }
    }

    public sealed class CosmosMongoClientManager
    {
        private CosmosMongoClientManager() { }

        static CosmosMongoClientManager()
        {
        }

        public static string DataconnectionString;

        private static readonly Lazy<MongoClient> _instance =
            new Lazy<MongoClient>(() =>
            {
                MongoClientSettings settings = MongoClientSettings.FromUrl(
                    new MongoUrl(CosmosMongoClientManager.DataconnectionString));

                settings.SslSettings =
                      new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
                settings.LinqProvider = LinqProvider.V2;

                return new MongoClient(settings);

            });

        public static MongoClient Instance
        {
            get { return _instance.Value; }
        }
    }
}
