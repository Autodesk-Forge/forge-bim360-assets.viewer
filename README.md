# View BIM 360 Assets

![Platforms](https://img.shields.io/badge/platform-Windows|MacOS-lightgray.svg)
![.NET](https://img.shields.io/badge/.NET%20Core-3.1-blue.svg)
[![License](http://img.shields.io/:license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](http://developer.autodesk.com/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)
[![Viewer](https://img.shields.io/badge/Viewer-v6-green.svg)](http://developer.autodesk.com/)
[![BIM-360](https://img.shields.io/badge/BIM%20360-v1-green.svg)](http://developer.autodesk.com/)

![Intermediate](https://img.shields.io/badge/Level-Intermediate-blue.svg)

# Description

**Under Construction**

Demonstrate how to read BIM 360 **Assets** data with Forge Viewer.

Uses [Data Management](https://developer.autodesk.com/en/docs/data/v2) to list hubs, projects and files. Uses [Viewer](https://developer.autodesk.com/en/docs/viewer/v6/overview/) to show models and extensions to create toolbar buttons and panels. The sample implements the following features in the **BIM360AssetExtension.js**:

- **BIM360AssetListPanel**: Lists [BIM 360](https://developer.autodesk.com/en/docs/bim360/v1/overview/) Assets on a data table with pagination support on the panel
- **BIM360AssetInfoPanel**: Display asset data of selected object from [BIM 360](https://developer.autodesk.com/en/docs/bim360/v1/overview/) Assets module.
- **BIM360SpaceFilterPanel**: Lists levels and rooms of the RVT model in a tree hierarchy, and it can apply proper section box (filter) to the model upon checked level or room to bring better view for assets.

## Thumbnail

![thumbnail-1](/thumbnail-1.png)

![thumbnail-2](/thumbnail-2.png)

## Demonstration

[![](http://img.youtube.com/vi/aNLFpVgeOVc/0.jpg)](http://www.youtube.com/watch?v=aNLFpVgeOVc "Demo the possibility of BIM360 Assets API & Forge Viewer Integration")

## Live version

[bim360assets.herokuapp.com](https://bim360assets.herokuapp.com/)

# Setup

## Prerequisites

1. **BIM 360 Account**: must be Account Admin to add the app integration. [Learn about provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps).
2. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/). 
3. **Visual Studio**: Either Community 2017+ (Windows) or Code (Windows, MacOS).
4. **.NET Core** basic knowledge with C#
5. **JavaScript** basic knowledge with **jQuery**

## Sample Files

Check `Sample Files` folder for testing RVT files, it includes assets with preset Revit shared parameters (`Asset ID`, `Asset Location` and `Asset Category`) that can be used to initialize your demo project of the BIM360 Assets. To import that data, please checkout these two awesome samples: [forge-bim360.asset.exchange.excel](https://github.com/xiaodongliang/forge-bim360.asset.exchange.excel) and [forge-revit.extract.assert-bim360](https://github.com/JohnOnSoftware/forge-revit.extract.assert-bim360).

### Work with your models

To work with your own RVT model, you can take advantage of two Dynamo Scripts inside the `Sample Files`:

- **ListAssetLocation.dyn**: Lists locations data (levels and rooms) and export to Excel file for setting up your BIM360 [Locations](https://help.autodesk.com/view/BIM360D/ENU/?guid=BIM360D_Administration_About_Project_Admin_about_location_html) data.
- **ListElementsByRooms.dyn**: Creates necessary Revit shared parameters (`Asset ID`, `Asset Location` and `Asset Category`) and set up their values for Mechanical Equipments, Air Terminals, Electric Fixtures, Electrical Equipments, Lighting Devices, and Lighting Fixtures, then export those parameter values Excel file for setting up your BIM360 [Assets](https://help.autodesk.com/view/BIM360D/ENU/?guid=BIM360D_Assets_about_assets_assets_overview_html) data.

## Running locally

Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone https://github.com/autodesk-forge/forge-bim360-assets

**Visual Studio** (Windows):

Right-click on the project, then go to **Debug**. Adjust the settings as shown below. 

![](bim360issues/wwwroot/img/readme/visual_studio_settings.png) 

**Visual Sutdio Code** (Windows, MacOS):

Open the folder, at the bottom-right, select **Yes** and **Restore**. This restores the packages (e.g. Autodesk.Forge) and creates the launch.json file. See *Tips & Tricks* for .NET Core on MacOS.

![](bim360issues/wwwroot/img/readme/visual_code_restore.png)

At the `.vscode\launch.json`, find the env vars and add your Forge Client ID, Secret and callback URL. Also define the `ASPNETCORE_URLS` variable. The end result should be as shown below:

```json
"env": {
    "ASPNETCORE_ENVIRONMENT": "Development",
    "ASPNETCORE_URLS" : "http://localhost:3000",
    "FORGE_CLIENT_ID": "your id here",
    "FORGE_CLIENT_SECRET": "your secret here",
    "FORGE_CALLBACK_URL": "http://localhost:3000/api/forge/callback/oauth",
},
```

Run the app. Open `http://localhost:3000` to view your files. It may be required to **Enable my BIM 360 Account** (see app top-right). Click on 

## Deployment

To deploy this application to Heroku, the **Callback URL** for Forge must use your `.herokuapp.com` address. After clicking on the button below, at the Heroku Create New App page, set your Client ID, Secret and Callback URL for Forge.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Watch [this video](https://www.youtube.com/watch?v=Oqa9O20Gj0c) on how deploy samples to Heroku.

# Further Reading

Documentation:

- [BIM 360 API](https://developer.autodesk.com/en/docs/bim360/v1/overview/) and [App Provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps)
- [Data Management API](https://developer.autodesk.com/en/docs/data/v2/overview/)
- [Viewer](https://developer.autodesk.com/en/docs/viewer/v6)

Tutorials:

- [View BIM 360 Models](http://learnforge.autodesk.io/#/tutorials/viewhubmodels)
- [Using the Assets API](https://forge.autodesk.com/en/docs/bim360-private/v1/overview/field-guide/using-assets-api/)
- [Assets Related APIs](https://forge.autodesk.com/en/docs/bim360-private/v1/overview/field-guide/assets-related-apis/)

Blogs:

- [Forge Blog](https://forge.autodesk.com/categories/bim-360-api)
- [Field of View](https://fieldofviewblog.wordpress.com/), a BIM focused blog

### Tips & Tricks

This sample uses .NET Core and works fine on both Windows and MacOS, see [this tutorial for MacOS](https://github.com/augustogoncalves/dotnetcoreheroku).

### Troubleshooting

1. **Cannot see my BIM 360 projects**: Make sure to provision the Forge App Client ID within the BIM 360 Account, [learn more here](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). This requires the Account Admin permission.

2. **Error setting certificate verify locations** error: may happen on Windows, use the following: `git config --global http.sslverify "false"`

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by

Eason Kang [@yiskang](https://twitter.com/yiskang), [Forge Partner Development](http://forge.autodesk.com)
