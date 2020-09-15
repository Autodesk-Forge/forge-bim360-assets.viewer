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

using System;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using bim360assets.Libs;
using System.Linq;

namespace bim360assets.Models
{
    /// <summary>
    /// Location
    /// </summary>
    public class Location
    {
        public Location()
        {
            this.Path = new List<string>();
        }

        /// <summary>
        /// Node id
        /// </summary>
        [Key]
        public string Id { get; set; }
        /// <summary>
        /// Parent node Id. null if this is the root node
        /// </summary>
        public string ParentId { get; set; }
        public string Type { get; set; }
        /// <summary>
        /// Node name
        /// </summary>
        [MaxLength(255)]
        public string Name { get; set; }
        /// <summary>
        /// Description
        /// </summary>
        public string Description { get; set; }
        public string Barcode { get; set; }
        /// <summary>
        /// Node order. This number represents the relative position of a node under its parent. A node with a smaller order value will be positioned in front of a node with a higher order value.
        /// </summary>
        public int Order { get; set; }
        /// <summary>
        /// Node document count
        /// </summary>
        public string DocumentCount { get; set; }
        /// <summary>
        /// Flag that indicates if an area has been defined
        /// </summary>
        public bool AreaDefined { get; set; }
        /// <summary>
        /// Path information from the root node to the current node. This information is only included if you use the filter[id] parameter
        /// </summary>
        public List<string> Path { get; set; }
        /// <summary>
        /// The list of child location
        /// </summary>
        public List<Location> Children { get; set; }

        public static List<Location> BuildTree(List<Location> list, string parentId)
        {
            return list.Where(x => x.ParentId == parentId).Select(x =>
            {
                Location loc = x.MemberwiseClone() as Location;
                loc.Children = BuildTree(list, x.Id);
                return loc;
            }).ToList();
        }
    }
}