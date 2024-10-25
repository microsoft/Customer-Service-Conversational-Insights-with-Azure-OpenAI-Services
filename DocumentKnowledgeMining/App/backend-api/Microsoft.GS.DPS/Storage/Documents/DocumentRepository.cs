// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT License.

using Microsoft.GS.DPS.Storage.Components;
using System.Collections.Specialized;
using MongoDB.Driver;
using System.ComponentModel;
using MongoDB.Bson;

namespace Microsoft.GS.DPS.Storage.Document
{


    public class DocumentRepository 
    {
        private readonly IMongoCollection<Entities.Document> _collection;
        public DocumentRepository(IMongoDatabase database, string collectionName) 
        {
            _collection = database.GetCollection<Entities.Document>(collectionName);

            // if Database is empty, create a new collection
            if (_collection == null)
            {
                database.CreateCollection(collectionName);
                _collection = database.GetCollection<Entities.Document>(collectionName);
            }
          
            // Ensure indexs
            EnsureIndexesOnField("ImportedTime");
            EnsureIndexesOnField("DocumentId");
            EnsureIndexesOnField("FileName");
        }

        private void EnsureIndexesOnField(string indexFieldName)
        {
            var indexKeysDefinition = Builders<Entities.Document>.IndexKeys.Descending(indexFieldName);
            var indexModel = new CreateIndexModel<Entities.Document>(indexKeysDefinition);

            // Check if the index already exists
            var indexes = _collection.Indexes.List().ToList();
            var indexExists = indexes.Any(index => index["key"].AsBsonDocument.Contains(indexFieldName));

            if (!indexExists)
            {
                _collection.Indexes.CreateOne(indexModel);
            }
        }

        public async Task<IEnumerable<Entities.Document>> GetAllDocuments()
        {
            //Get All Records then get only Keywords field.
            //This is to avoid getting the whole document and only get the keywords field
            return await _collection.Find(Builders<Entities.Document>.Filter.Empty)
                                    .Project<Entities.Document>(Builders<Entities.Document>.Projection.Include(x => x.Keywords))
                                    .ToListAsync();
        }

        public async Task<QueryResultSet> GetAllDocumentsByPageAsync(int pageNumber, int pageSize, DateTime? startDate, DateTime? endDate)
        {
            //Make filter by StartDate and EndDate
            //Just in case StartDate is null and EndDate only, define filter between Current and EndDate
            //Just in case StartDate and EndDate is not null, define filter between StartDate and EndDate
            //endDate should be converted from datetime to DateTime of end of day Day:23:59:59

            //FilterDefinition<Entities.Document> filter = Builders<Entities.Document>.Filter.Empty;

            List<FilterDefinition<Entities.Document>> filters = new List<FilterDefinition<Entities.Document>>();

            if (startDate.HasValue) {
                // startDate = startDate?.Date.AddHours(0).AddMinutes(0).AddSeconds(0);
                // UI itself is calculates the start date so we dont need to add above line -bugID:8948
                filters.Add(Builders<Entities.Document>.Filter.Gte(x => x.ImportedTime, startDate));
                filters.Add(Builders<Entities.Document>.Filter.Lte(x => x.ImportedTime, endDate ?? DateTime.Now));

            }

            var combinedFilter = filters.Count > 0 ? Builders<Entities.Document>.Filter.And(filters) : Builders<Entities.Document>.Filter.Empty;

            return await this.GetDocumentsByPageAsync(combinedFilter,
                                                      Builders<Entities.Document>.Sort.Descending(x => x.ImportedTime),
                                                      pageNumber,
                                                      pageSize);
        }

        public async Task<QueryResultSet> FindByTagsAsync(Dictionary<string,string> keywords, int pageNumber, int pageSize)
        {
            //Define filter from keywords
            var filters = new List<FilterDefinition<Entities.Document>>();

            foreach (var kvp in keywords)
            {
                var values = kvp.Value.Split(',').Select(v => v.Trim()).ToArray();
                var regexPattern = string.Join("|", values.Select(v => $"\\b{v}\\b"));
                var filter = Builders<Entities.Document>.Filter.Regex($"Keywords.{kvp.Key}", new BsonRegularExpression(regexPattern, "i"));
                filters.Add(filter);
            }

            var combinedFilter = Builders<Entities.Document>.Filter.And(filters);

            return await this.GetDocumentsByPageAsync(combinedFilter,
                                                      Builders<Entities.Document>.Sort.Descending(x => x.ImportedTime),
                                                      pageNumber,
                                                      pageSize);
        }

        private async Task<QueryResultSet> GetDocumentsByPageAsync(FilterDefinition<Entities.Document> filterDefinition, 
                                                                                   SortDefinition<Entities.Document> sortDefinition, 
                                                                                   int pageNumber, 
                                                                                   int pageSize)
        {
            var skip = (pageNumber - 1) * pageSize;
            var documents = await _collection.Find(filterDefinition)
                                             .Sort(sortDefinition)
                                             .Skip(skip)
                                             .Limit(pageSize)
                                             .ToListAsync();

            var totalCount = await GetTotalCountAsync(filterDefinition);

            return new QueryResultSet() {
                Results = documents,
                TotalPages = GetTotalPages(pageSize, totalCount),
                TotalRecords = totalCount,
                CurrentPage = pageNumber

            };

        }

        private async Task<int> GetTotalCountAsync(FilterDefinition<Entities.Document> filterDefinition)
        {
            return (int)await _collection.CountDocumentsAsync(filterDefinition);
        }

        private int GetTotalPages(int pageSize, double recordsCount)
        {
            return (int)Math.Ceiling((double)recordsCount / pageSize);
        }

        public async Task<Entities.Document> RegisterAsync(Entities.Document document)
        {
            await _collection.InsertOneAsync(document);
            return document;
        }

        public async Task<Entities.Document> UpdateAsync(Entities.Document document)
        {
            var result = await _collection.ReplaceOneAsync(Builders<Entities.Document>.Filter.Eq(x => x.id, document.id), document);
            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                return document;
            }
            else
            {
                return null;
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            await _collection.DeleteOneAsync(Builders<Entities.Document>.Filter.Eq(x => x.id, id));
        }

        async public Task<Entities.Document> FindByIdAsync(Guid id)
        {
            return await _collection.Find(Builders<Entities.Document>.Filter.Eq(x => x.id, id)).FirstOrDefaultAsync();
        }


        async public Task<Entities.Document> FindByDocumentIdAsync(string documentId)
        {
            var filterDefinition = Builders<Entities.Document>.Filter.Eq(x => x.DocumentId, documentId);
            return await _collection.Find(filterDefinition).FirstOrDefaultAsync();
        }


        async public Task<QueryResultSet> FindByDocumentIdsAsync(string[] documentIds)
        {
            return await this.FindByDocumentIdsAsync(documentIds, 1, 100);
        }

        async public Task<QueryResultSet> FindByDocumentIdsAsync(string[] documentIds, 
                                                                int pageNumber, 
                                                                int pageSize, 
                                                                DateTime? startDate = null, 
                                                                DateTime? endDate = null)
        {
            var filterDefinition = Builders<Entities.Document>.Filter.In(x => x.DocumentId, documentIds);

            //Make filter by StartDate and EndDate
            //Just in case StartDate is null and EndDate only, define filter between Current and EndDate
            //Just in case StartDate and EndDate is not null, define filter between StartDate and EndDate
            //endDate should be converted from datetime to DateTime of end of day Day:23:59:59

            FilterDefinition<Entities.Document> filter = Builders<Entities.Document>.Filter.Empty;

            if (endDate.HasValue)
            {
                endDate = endDate?.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                filter = Builders<Entities.Document>.Filter.Gte(x => x.ImportedTime, startDate ?? DateTime.Now) &
                              Builders<Entities.Document>.Filter.Lte(x => x.ImportedTime, endDate ?? endDate);

            }


            return await this.GetDocumentsByPageAsync(filterDefinition, Builders<Entities.Document>.Sort.Descending(x => x.ImportedTime), pageNumber, pageSize);
        }
    }
}
