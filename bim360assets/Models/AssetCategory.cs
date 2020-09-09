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
    /// Asset Category
    /// </summary>
    public class AssetCategory
    {
        public AssetCategory()
        {
            this.SubcategoryIds = new List<string>();
            this.Subcategories = new List<AssetCategory>();
        }

        [Key]
        public string Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        [JsonConverter(typeof(EmptyStringToNullJsonConverter))]
        public string CreatedByUser { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        [JsonConverter(typeof(EmptyStringToNullJsonConverter))]
        public string UpdatedByUser { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string DeletedBy { get; set; }
        [JsonConverter(typeof(EmptyStringToNullJsonConverter))]
        public string DeletedByUser { get; set; }
        public bool IsActive { get; set; }
        /// <summary>
        /// The name of the category. Must be unique among children of the same parent category.
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Description of the category.
        /// </summary>
        public string Description { get; set; }
        /// <summary>
        /// The ID of the parent Category
        /// </summary>
        public string ParentId { get; set; }
        /// <summary>
        /// Whether this Category is the root category
        /// </summary>
        public bool IsRoot { get; set; }
        /// <summary>
        /// Whether this Category is a leaf category
        /// </summary>
        public bool IsLeaf { get; set; }
        /// <summary>
        /// The list of child Category IDs
        /// </summary>
        public List<string> SubcategoryIds { get; set; }
        /// <summary>
        /// The list of child Category
        /// </summary>
        public List<AssetCategory> Subcategories { get; set; }        

        public static List<AssetCategory> BuildTree(List<AssetCategory> list, string parentId)
        {
            return list.Where(x => x.ParentId == parentId).Select(x =>
            {
                AssetCategory cate = x.MemberwiseClone() as AssetCategory;
                cate.Subcategories = BuildTree(list, x.Id);
                return cate;
            }).ToList();
        }
    }
}