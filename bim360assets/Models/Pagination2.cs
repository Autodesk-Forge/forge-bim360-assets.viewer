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

namespace bim360assets.Models
{
    /// <summary>
    /// Type 2 Pagination for BIM360 API
    /// </summary>
    public class Pagination2
    {
        /// <summary>
        /// The ‘limit’ value used by this request
        /// </summary>
        public int Limit { get; set; }
        /// <summary>
        /// The ‘offset’ value used for this request
        /// </summary>
        public int Offset { get; set; }
        /// <summary>
        /// The total number of nodes that satisfies the query
        /// </summary>
        public int TotalResults { get; set; }
        /// <summary>
        /// URL path that will return the previous page of data
        /// </summary>
        public string Previous { get; set; }
        /// <summary>
        /// URL path that will return the next page of data
        /// </summary>
        public string Next { get; set; }
    }
}