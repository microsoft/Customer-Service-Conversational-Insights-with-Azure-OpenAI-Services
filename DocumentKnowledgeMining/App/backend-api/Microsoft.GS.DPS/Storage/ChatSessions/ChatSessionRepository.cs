using Microsoft.GS.DPS.Storage.Components;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Storage.ChatSessions
{
    public class ChatSessionRepository
    {
        private readonly IMongoCollection<Entities.ChatSession> _collection;

        public ChatSessionRepository(IMongoDatabase database, string collectionName)
        {
            _collection = database.GetCollection<Entities.ChatSession>(collectionName);

            if (_collection == null)
            {
                database.CreateCollection(collectionName);
                _collection = database.GetCollection<Entities.ChatSession>(collectionName);
            }
        }

        /// <summary>
        /// Create new ChatSession Entity
        /// </summary>
        /// <param name="chatSession"></param>
        /// <returns></returns>
        public async Task<Entities.ChatSession> RegisterSessionAsync(Entities.ChatSession chatSession)
        {
            //return await this.EntityCollection.AddAsync(chatSession);
            await _collection.InsertOneAsync(chatSession);
            return chatSession;
        }

        /// <summary>
        /// Get Registered ChatSession Entity with given sessionId
        /// </summary>
        /// <param name="sessionId"></param>
        /// <returns></returns>
        public async Task<Entities.ChatSession> GetSessionAsync(string sessionId)
        {
            return await _collection.Find(Builders<Entities.ChatSession>.Filter.Eq(x => x.SessionId, sessionId)).FirstOrDefaultAsync();
        }

        public async Task<Entities.ChatSession> UpdateSessionAsync(Entities.ChatSession chatSession)
        {
            //return await this.EntityCollection.SaveAsync(chatSession);
            var result = await _collection.ReplaceOneAsync(Builders<Entities.ChatSession>.Filter.Eq(x => x.id, chatSession.id), chatSession);
            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                return chatSession;
            }
            else
            {
                await _collection.InsertOneAsync(chatSession);
                return chatSession;
            }
        }


        public async Task<bool> DeleteSessionAsync(string sessionId)
        {
            return _collection.DeleteOne(Builders<Entities.ChatSession>.Filter.Eq(x => x.SessionId, sessionId)).DeletedCount > 0;
        }


        private async Task<Entities.ChatSession> GetSessionBySessionIdAsync(string sessionId)
        {
            return await _collection.Find(Builders<Entities.ChatSession>.Filter.Eq(x => x.SessionId, sessionId)).FirstOrDefaultAsync();
        }
    }
}
