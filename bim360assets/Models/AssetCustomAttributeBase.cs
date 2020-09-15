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

namespace bim360assets.Models
{
    /// <summary>
    /// Base Asset Status
    /// </summary>
    public class AssetCustomAttributeBase {
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
        public int Version { get; set; }
        public string ProjectId { get; set; }
        /// <summary>
        /// The human readable display name for the Asset Custom Attribute
        /// </summary>
        [MaxLength(100)]
        public string DisplayName { get; set; }
    }
}