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
    public class AssetCustomAttribute : AssetCustomAttributeBase
    {
        public AssetCustomAttribute()
        {
            this.Values = new List<AssetCustomAttributeValue>();
        }

        /// <summary>
        /// The display name for the Status Set
        /// </summary>
        [MaxLength(100)]
        public string Name { get; set; }
        /// <summary>
        /// The description of the Status Set
        /// </summary>
        [MaxLength(500)]
        public string Description { get; set; }
        /// <summary>
        /// Required when dataType is “select” or “multi_select”. Defines the allowed values this custom attribute can take on.
        /// </summary>
        public List<string> EnumValues { get; set; }
        /// <summary>
        /// Flags an Asset Custom Attribute as required when editing an Asset. Does not guarantee that all existing Assets will have this attribute.
        /// </summary>
        public bool RequiredOnIngress { get; set; }
        /// <summary>
        /// Only applies when dataType is “text”. Defines a max length that can be set for the custom attribute when editing an Asset. Does not guarantee that all existing Assets will meet this max length.
        /// </summary>
        public int MaxLengthOnIngress { get; set; }
        /// <summary>
        /// Indicates the type of the Asset Custom Attribute. Immutable after creation. Possible values: boolean, text, numeric, date, select, multi_select
        /// </summary>
        public object DefaultValue { get; set; }
        /// <summary>
        /// Indicates the type of the Asset Custom Attribute. Immutable after creation. Possible values: boolean, text, numeric, date, select, multi_select
        /// </summary>
        public string DataType { get; set; }
        public List<AssetCustomAttributeValue> Values { get; set; }
    }
}