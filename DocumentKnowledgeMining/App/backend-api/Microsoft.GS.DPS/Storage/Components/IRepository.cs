// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Storage.Components
{
    /// <summary>
    /// Default CRUD operations in CosmosDB
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <typeparam name="TIdentifier"></typeparam>
    public interface IRepository<TEntity, TIdentifier>
    {
        Task<TEntity> AddAsync(TEntity entity);
        Task DeleteAsync(TEntity entity, dynamic? partitionKeyValue = null);
        Task DeleteAsync(TIdentifier entityId, dynamic? partitionKeyValue = null);
        Task<TEntity> FindAsync(ISpecification<TEntity> specification);
        Task<IEnumerable<TEntity>> FindAllAsync(ISpecification<TEntity> specification);
        Task<TEntity> GetAsync(TIdentifier id);
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<IEnumerable<TEntity>> GetAllAsync(IEnumerable<TIdentifier> identifiers);
        Task<TEntity> SaveAsync(TEntity entity);
    }
}
