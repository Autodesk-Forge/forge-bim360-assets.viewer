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
    /// PaginatedLocations
    /// </summary>
    public class PaginatedLocations
    {
        public PaginatedLocations()
        {
            this.Results = new List<Location>();
        }

        /// <summary>
        /// Page info
        /// </summary>
        public Pagination2 Pagination { get; set; }

        /// <summary>
        /// An array of Location
        /// </summary>
        public List<Location> Results { get; set; }
    }
}