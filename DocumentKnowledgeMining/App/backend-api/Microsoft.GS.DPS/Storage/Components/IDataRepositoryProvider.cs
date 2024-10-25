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
    /// Interface for DI in each CosmosDB Helpers
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    public interface IDataRepositoryProvider<TEntity, TIdentifier>
    {
        /// <summary>
        /// Entity Object Collections which has Database CRUD operations
        /// </summary>
        IRepository<TEntity, TIdentifier> EntityCollection { get; init; }
    }

}
