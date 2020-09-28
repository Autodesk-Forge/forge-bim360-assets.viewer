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
    public class BatchUpdateAssetCustomAttributeEorrorMessage
    {
        public string Type { get; set; }
        public string Message { get; set; }
    }

    public class BatchUpdateFailedAssetCustomAttributeData : BatchUpdateAssetCustomAttributeData
    {
        public BatchUpdateFailedAssetCustomAttributeData() : base()
        {
            this.Error = new BatchUpdateAssetCustomAttributeEorrorMessage();
        }

        public BatchUpdateFailedAssetCustomAttributeData(BatchUpdateAssetCustomAttributeData parent) : base()
        {
            this.AssetId = parent.AssetId;
            this.Data = parent.Data;
            this.Error = new BatchUpdateAssetCustomAttributeEorrorMessage();
        }

        public BatchUpdateAssetCustomAttributeEorrorMessage Error { get; set; }
    }

    public class BatchUpdateAssetCustomAttributeResult
    {
        public BatchUpdateAssetCustomAttributeResult()
        {
            this.SuccessItems = new List<BatchUpdateAssetCustomAttributeData>();
            this.FailureItems = new List<BatchUpdateFailedAssetCustomAttributeData>();
        }

        public List<BatchUpdateAssetCustomAttributeData> SuccessItems { get; set; }
        public List<BatchUpdateFailedAssetCustomAttributeData> FailureItems { get; set; }
    }
}