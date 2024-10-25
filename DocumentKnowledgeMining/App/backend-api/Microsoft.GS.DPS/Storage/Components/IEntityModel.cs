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
    /// Every Entnties have to follow this interface
    /// Unique identifier type should be string
    /// </summary>
    /// <typeparam name="TIdentifier"></typeparam>
    public interface IEntityModel<TIdentifier>
    {
        TIdentifier id { get; set; }
        string __partitionkey { get; set; }
    }
}
