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
    /// Asset
    /// </summary>
    public class Asset
    {
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
        /// <summary>
        /// ID of the Asset
        /// </summary>
        public string ClientAssetId { get; set; }
        /// <summary>
        /// ID of the Category the Asset belongs to
        /// </summary>
        public string CategoryId { get; set; }
        /// <summary>
        /// The Category the Asset belongs to
        /// </summary>
        public string Category { get; set; }
        /// <summary>
        /// ID of the Asset Status assigned to the Asset
        /// </summary>
        public string StatusId { get; set; }
        /// <summary>
        /// The Asset Status assigned to the Asset
        /// </summary>
        public string Status { get; set; }
        /// <summary>
        /// Brief description
        /// </summary>
        public string Description { get; set; }
        /// <summary>
        /// ID of the Location of the Asset (references Locations API)
        /// </summary>
        public string LocationId { get; set; }
        /// <summary>
        /// The Location of the Asset (references Locations API)
        /// </summary>
        public string Location { get; set; }
        /// <summary>
        /// Barcode
        /// </summary>
        public string Barcode { get; set; }
        /// <summary>
        /// Serial Number
        /// </summary>
        public string SerialNumber { get; set; }
        /// <summary>
        /// Submittal ID
        /// </summary>
        public string Submittal { get; set; }
        /// <summary>
        /// Spec Section
        /// </summary>
        public string SpecSection { get; set; }
        /// <summary>
        /// Purchase order number
        /// </summary>
        public string PurchaseOrder { get; set; }
        /// <summary>
        /// Date of purchase in YYYY-MM-DDThh:mm:ss.sssZ format
        /// </summary>
        public DateTime? PurchaseDate { get; set; }
        /// <summary>
        /// ID of user who installed the Asset
        /// </summary>
        public string InstalledBy { get; set; }
        [JsonConverter(typeof(EmptyStringToNullJsonConverter))]
        public string InstalledByUser { get; set; }
        /// <summary>
        /// Date of installation in YYYY-MM-DDThh:mm:ss.sssZ format
        /// </summary>
        public DateTime? InstallationDate { get; set; }
        /// <summary>
        /// Warranty Start Date in YYYY-MM-DDThh:mm:ss.sssZ format
        /// </summary>
        public DateTime? WarrantyStartDate { get; set; }
        /// <summary>
        /// Warranty End Date in YYYY-MM-DDThh:mm:ss.sssZ format
        /// </summary>
        public DateTime? WarrantyEndDate { get; set; }
        /// <summary>
        /// Expected life, in years
        /// </summary>
        public double ExpectedLifeYears { get; set; }
        /// <summary>
        /// Manufacturer
        /// </summary>
        public string Manufacturer { get; set; }
        /// <summary>
        /// Model
        /// </summary>
        public string Model { get; set; }
        /// <summary>
        /// The Asset Custom Attribute values of this Asset. Can be any JSON blob with values that are compatible with the Asset Custom Attributes assigned to this Asset. For “text” dataType, the value is a string. For “date” dataType, the value is an ISO8601 date string with no time, e.g. “2020-04-10”. For “select” dataType, the value is a valid string from the list of allowed enum values. For “multi-select” dataType, the value is an array of strings from the list of allowed enum values. For “boolean” dataType, the value is a boolean. For “numeric” dataType, the value is a string that parses as a valid floating point number (not localized).
        /// </summary>
        public Dictionary<string, object> CustomAttributes { get; set; }
        /// <summary>
        /// The asset's default company ID in BIM 360
        /// </summary>
        public string CompanyId { get; set; }

        /// <summary>
        /// Returns the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
    }
}