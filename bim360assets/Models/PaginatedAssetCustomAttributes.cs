/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

using System.Collections.Generic;

namespace bim360assets.Models
{
    /// <summary>
    /// PaginatedAssetCustomAttributes
    /// </summary>
    public class PaginatedAssetCustomAttributes
    {
        public PaginatedAssetCustomAttributes()
        {
            this.Results = new List<AssetCustomAttribute>();
        }

        /// <summary>
        /// Page info
        /// </summary>
        public Pagination Pagination { get; set; }

        /// <summary>
        /// An array of AssetCustomAttribute
        /// </summary>
        public List<AssetCustomAttribute> Results { get; set; }
    }
}