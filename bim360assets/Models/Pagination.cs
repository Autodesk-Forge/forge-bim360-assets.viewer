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
    /// Pagination
    /// </summary>
    public class Pagination
    {
        /// <summary>
        /// An opaque, unique key element that identifies the first entry in the page.
        /// </summary>
        public string CursorState { get; set; }
        /// <summary>
        /// The maximum number of objects that MAY be returned. A query MAY return fewer than the value of limit due to filtering or other reasons.
        /// </summary>
        public int Limit { get; set; }
        /// <summary>
        /// URL for the next paginated request
        /// </summary>
        public string NextUrl { get; set; }
        /// <summary>
        /// Total number of results available
        /// </summary>
        public int TotalResults { get; set; }
    }
}