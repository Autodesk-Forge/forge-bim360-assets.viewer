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
using System.ComponentModel.DataAnnotations;

namespace bim360assets.Models
{
    /// <summary>
    /// User
    /// </summary>
    public class User
    {
        /// <summary>
        /// BIM 360 user ID
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// Account ID
        /// </summary>
        public string AccountId { get; set; }
        /// <summary>
        /// The role of the user in the account
        /// </summary>
        public string Role { get; set; }
        /// <summary>
        /// Status of the user in the system
        /// </summary>
        public string Status { get; set; }
        /// <summary>
        /// The user’s default company ID in BIM 360
        /// </summary>
        public string CompanyId { get; set; }
        /// <summary>
        /// The name of the user’s default company name in BIM 360
        /// </summary>
        public string CompanyName { get; set; }
        /// <summary>
        /// Timestamp of the last sign in, YYYY-MM-DDThh:mm:ss.sssZ format
        /// </summary>
        public DateTime LastSignIn { get; set; }
        /// <summary>
        /// User’s email
        /// </summary>
        [MaxLength(255)]
        public string Email { get; set; }
        /// <summary>
        /// User’s default display name
        /// </summary>
        [MaxLength(255)]
        public string Name { get; set; }
        /// <summary>
        /// User’s nick name
        /// </summary>
        [MaxLength(255)]
        public string Nickname { get; set; }
        /// <summary>
        /// User’s first name
        /// </summary>
        [MaxLength(255)]
        public string FirstName { get; set; }
        /// <summary>
        /// User’s last name
        /// </summary>
        [MaxLength(255)]
        public string LastName { get; set; }
        /// <summary>
        /// User's Autodesk ID
        /// </summary>
        public string Uid { get; set; }
        /// <summary>
        /// URL for user’s profile image
        /// </summary>
        [MaxLength(255)]
        public string ImageUrl { get; set; }
        /// <summary>
        /// User’s address line 1
        /// </summary>
        [MaxLength(255)]
        public string AddressLine1 { get; set; }
        /// <summary>
        /// User’s address line 2
        /// </summary>
        [MaxLength(255)]
        public string AddressLine2 { get; set; }
        /// <summary>
        /// City in which user is located
        /// </summary>
        [MaxLength(255)]
        public string City { get; set; }
        /// <summary>
        /// State or province in which user is located
        /// </summary>
        [MaxLength(255)]
        public string StateOrProvince { get; set; }
        /// <summary>
        /// Postal code for the user’s location
        /// </summary>
        [MaxLength(255)]
        public string PostalCode { get; set; }
        /// <summary>
        /// Country for this user
        /// Refer to the <b>country</b> list in the <a href="https://forge.autodesk.com/en/docs/bim360/v1/overview/parameters">Parameters</a> guide.
        /// </summary>
        public string Country { get; set; }
        /// <summary>
        /// Contact phone number for the user
        /// </summary>
        [MaxLength(255)]
        public string Phone { get; set; }
        /// <summary>
        /// Company information from the Autodesk user profile
        /// </summary>
        [MaxLength(255)]
        public string Company { get; set; }
        /// <summary>
        /// User’s job title
        /// </summary>
        [MaxLength(255)]
        public string JobTitle { get; set; }
        /// <summary>
        /// Industry information for user
        /// </summary>
        [MaxLength(255)]
        public string Industry { get; set; }
        /// <summary>
        /// Short description about the user
        /// </summary>
        [MaxLength(255)]
        public string AboutMe { get; set; }
        /// <summary>
        /// YYYY-MM-DDThh:mm:ss.sssZ format
        /// </summary>
        public DateTime? CreatedAt { get; set; }
        /// <summary>
        /// YYYY-MM-DDThh:mm:ss.sssZ format
        /// </summary>
        public DateTime? UpdatedAt { get; set; }
    }
}