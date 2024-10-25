// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT License.

using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Storage.Components
{
    public class BusinessTransactionRepository<TEntity, TIdentifier> : IRepository<TEntity, TIdentifier> where TEntity : class, IEntityModel<TIdentifier>
    {
        private readonly IMongoDatabase _database;


        public BusinessTransactionRepository(IMongoClient client, string databaseName)
        {
            _database = client.GetDatabase(databaseName);

            if (!BsonClassMap.IsClassMapRegistered(typeof(TEntity)))
                BsonClassMap.RegisterClassMap<TEntity>();
        }

        public async Task<TEntity> GetAsync(TIdentifier id)
        {
            var result = await _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant()).FindAsync<TEntity>(x => x.id.Equals(id));
            return await result.FirstOrDefaultAsync<TEntity>();
        }

        public async Task<TEntity> FindAsync(ISpecification<TEntity> specification)
        {
            var collection = _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant());
            return await collection.Find(specification.Predicate).FirstOrDefaultAsync();
        }


        public async Task<IEnumerable<TEntity>> FindAllAsync(FilterDefinition<TEntity> builders)
        {
            var collection = _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant());

            return (await collection.FindAsync(builders)).ToList<TEntity>();
        }


        public async Task<IEnumerable<TEntity>> FindAllAsync(ISpecification<TEntity> specification)
        {
            var collection = _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant());

            GenericSpecification<TEntity> genericSpecification = specification as GenericSpecification<TEntity>;

            if (genericSpecification.OrderBy == null)
            {
                return (await collection.FindAsync(specification.Predicate)).ToList<TEntity>();
            }
            else if (genericSpecification.Order == Order.Asc)
            {
                return (await collection.FindAsync(specification.Predicate, new FindOptions<TEntity>() { Sort = Builders<TEntity>.Sort.Ascending(specification.OrderBy) })).ToList<TEntity>();

            }
            else if (genericSpecification.Order == Order.Desc)
            {
                return (await collection.FindAsync(specification.Predicate, new FindOptions<TEntity>() { Sort = Builders<TEntity>.Sort.Descending(specification.OrderBy) })).ToList<TEntity>();
            }
            else
            {
                return null;
            }
        }


        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return (await _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant()).FindAsync(new BsonDocument())).ToList<TEntity>();

        }

        public async Task<IEnumerable<TEntity>> GetAllAsync(IEnumerable<TIdentifier> identifiers)
        {

            List<TEntity> results = new List<TEntity>();
            IMongoCollection<TEntity> collection = _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant());
            foreach (var i in identifiers)
            {
                results.Add(await this.GetAsync(i));
            }
            return results;
        }

        public async Task<TEntity> SaveAsync(TEntity entity)
        {
            var collection = _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant());

            await collection.ReplaceOneAsync(x => x.id.Equals(entity.id), entity, new ReplaceOptions
            {
                IsUpsert = true
            });

            return entity;
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            var collection = _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant());

            await collection.ReplaceOneAsync(x => x.id.Equals(entity.id), entity, new ReplaceOptions
            {
                IsUpsert = true
            });

            return entity;
        }

        public async Task DeleteAsync(TIdentifier entityId, dynamic partitionKeyValue = null)
        {
            var collection = _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant());

            await collection.DeleteOneAsync(x => x.id.Equals(entityId));
        }

        public async Task DeleteAsync(TEntity entity, dynamic partitionKeyValue = null)
        {
            var collection = _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLowerInvariant());

            await collection.DeleteOneAsync(x => x.id.Equals(entity.id));
        }

    }
}
