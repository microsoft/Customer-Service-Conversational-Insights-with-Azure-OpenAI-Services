using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;
using Microsoft.GS.DPS.Storage.Document;
using Timers =System.Timers;

namespace Microsoft.GS.DPS.API.UserInterface
{
    public class DataCacheManager
    {
        private readonly DocumentRepository _documentRepository;
        private Dictionary<string, List<string>> _keywordCache;
        private readonly Timers.Timer _cacheTimer;
        private readonly object _cacheLock = new object();

        public DataCacheManager(DocumentRepository documentRepository)
        {
            _documentRepository = documentRepository;
            _keywordCache = new Dictionary<string, List<string>>();
            _cacheTimer = new Timers.Timer(5 * 60 * 1000); // 5 minutes
            _cacheTimer.Elapsed += async (sender, e) => await RefreshCacheAsync();
            _cacheTimer.Start();
        }

        public async Task<Dictionary<string, List<string>>> GetConsolidatedKeywordsAsync()
        {
            if (_keywordCache.Count == 0)
            {
                await RefreshCacheAsync();
            }

            lock (_cacheLock)
            {
                return new Dictionary<string, List<string>>(_keywordCache);
            }
        }

        public async Task RefreshCacheAsync()
        {
            var consolidatedKeywords = new Dictionary<string, List<string>>();
            var documents = await _documentRepository.GetAllDocuments();

            foreach (var document in documents)
            {
                if (document.Keywords != null)
                {
                    foreach (var keywordDict in document.Keywords)
                    {
                        if (!consolidatedKeywords.ContainsKey(keywordDict.Key))
                        {
                            consolidatedKeywords[keywordDict.Key] = new List<string>();
                        }

                        var values = keywordDict.Value.Split(',').Select(v => v.Trim()).ToArray();

                        foreach (var value in values)
                        {
                            if (!consolidatedKeywords[keywordDict.Key].Contains(value))
                            {
                                consolidatedKeywords[keywordDict.Key].Add(value);
                            }
                        }

                        consolidatedKeywords[keywordDict.Key] = consolidatedKeywords[keywordDict.Key].OrderBy(v => v).ToList();
                    }
                }
            }

            consolidatedKeywords = consolidatedKeywords.OrderBy(k => k.Key).ToDictionary(k => k.Key, v => v.Value);

            lock (_cacheLock)
            {
                _keywordCache = consolidatedKeywords;
            }
        }

        public void ManualRefresh()
        {
            _cacheTimer.Stop();
            _cacheTimer.Start();
            Task.Run(async () => await RefreshCacheAsync());
        }
    }
}
