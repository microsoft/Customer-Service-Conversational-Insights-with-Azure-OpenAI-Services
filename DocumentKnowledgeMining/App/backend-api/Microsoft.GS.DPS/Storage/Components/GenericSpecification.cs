// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Storage.Components
{
    public class GenericSpecification<TEntity> : ISpecification<TEntity>
    {
        public GenericSpecification(Expression<Func<TEntity, bool>> predicate, Expression<Func<TEntity, dynamic>> orderBy = null, Order order = Order.Asc)
        {
            Predicate = predicate;
            OrderBy = orderBy;
            Order = order;
        }
        /// <summary>
        /// Gets or sets the func delegate query to execute against the repository for searching records.
        /// </summary>
        public Expression<Func<TEntity, bool>> Predicate { get; }
        public Expression<Func<TEntity, dynamic>> OrderBy { get; }
        public Order Order { get; }
    }

    public enum Order
    {
        Asc,
        Desc
    }
}
