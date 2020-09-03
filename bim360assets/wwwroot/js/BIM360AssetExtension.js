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

(function () {
    class BIM360AssetListPanel extends Autodesk.Viewing.UI.DockingPanel {
        constructor(viewer, title, options) {
            options = options || {};

            //  Height adjustment for scroll container, offset to height of the title bar and footer by default.
            if (!options.heightAdjustment)
                options.heightAdjustment = 70;

            if (!options.marginTop)
                options.marginTop = 0;

            options.addFooter = false;

            super(viewer.container, viewer.container.id + 'BIM360AssetListPanel', title, options);

            this.container.classList.add('bim360-docking-panel');
            this.container.classList.add('bim360-asset-list-panel');

            this.viewer = viewer;
            this.options = options;
            this.uiCreated = false;

            this.addVisibilityListener(async (show) => {
                if (!show) return;

                if (!this.uiCreated)
                    await this.createUI();
            });
        }

        async getAssets(cursorState, limit) {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const assets = await this.getRemoteAssets(data.hubId, data.projectId, cursorState, limit);
                    resolve(assets);
                    console.log(assets);
                } catch (ex) {
                    reject(new Error(ex));
                }
            });
        }

        async getHqProjectId(href) {
            return new Promise(async (resolve, reject) => {
                fetch(`/api/forge/bim360/hq/project?href=${href}`, {
                    method: 'get',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return reject(
                                new Error(`Failed to fetch HQ project info from server (status: ${response.status}, message: ${response.statusText})`)
                            );
                        }
                    })
                    .then((data) => {
                        if (!data) return reject(new Error('Empty response'));

                        resolve(data);
                    })
                    .catch((error) => reject(error));
            });
        }

        async getRemoteAssets(accountId, projectId, cursorState, limit) {
            return new Promise((resolve, reject) => {
                let query = '';
                if (limit) {
                    query += `pageLimit=${limit}`
                    // } else {
                    //     // Todo: fix back previous bug 
                    //     // Todo: check cursorState meaning with asset team, current cursorState is the same with nextUrl
                    //     //query += 'pageLimit=3'
                    //     query += 'pageLimit=5'
                }

                if (cursorState) {
                    query += `&cursorState=${cursorState}`
                }

                fetch(`/api/forge/bim360/account/${accountId}/project/${projectId}/assets?${query}`, {
                    method: 'get',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return reject(
                                new Error(`Failed to fetch BIM360 Assets from server (status: ${response.status}, message: ${response.statusText})`)
                            );
                        }
                    })
                    .then((data) => {
                        if (!data) return reject(new Error('Empty response'));

                        resolve(data);
                    })
                    .catch((error) => reject(error));
            });
        }

        async getUsers() {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const users = await this.getRemoteUsers(data.hubId, data.projectId);
                    resolve(users);
                    console.log(users);
                } catch (ex) {
                    reject(new Error(ex));
                }
            });
        }

        async getRemoteUsers(accountId, projectId) {
            return new Promise((resolve, reject) => {
                fetch(`/api/forge/bim360/account/${accountId}/project/${projectId}/users`, {
                    method: 'get',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return reject(
                                new Error(`Failed to fetch BIM360 Assets from server (status: ${response.status}, message: ${response.statusText})`)
                            );
                        }
                    })
                    .then((data) => {
                        if (!data) return reject(new Error('Empty response'));

                        resolve(data);
                    })
                    .catch((error) => reject(error));
            });
        }

        async createUI() {
            this.uiCreated = true;
            const dataTable = new Autodesk.Viewing.UI.DataTable(this);
            dataTable._createRows();
            this.dataTable = dataTable;

            await this.updateDataTable();

            this.createPagination();
            this.updatePagination();
        }

        clearDataTable() {
            const dataTable = this.dataTable;
            if (!dataTable) return;

            while (dataTable.datatableDiv.firstChild) {
                dataTable.datatableDiv.removeChild(dataTable.datatableDiv.lastChild);
            }
        }

        async updateDataTable(cursorState, limit) {
            const dataTable = this.dataTable;
            if (!dataTable) return;

            const tableHeaders = ['Asset ID', 'Category', 'Location', 'Manufacturer', 'Model', 'Status'];
            const tableContents = [];
            const assets = await this.getAssets(cursorState, limit);
            if (!assets || assets.results.length <= 0)
                return;

            const users = await this.getUsers();
            if (!users || users.length <= 0)
                return;

            this.clearDataTable();

            if (this.assets)
                this.prevPagination = this.assets.pagination;

            const data = assets.results;
            this.assets = assets;

            while (dataTable.datatableDiv.firstChild) {
                dataTable.datatableDiv.removeChild(dataTable.datatableDiv.lastChild);
            }

            for (let i = 0; i < data.length; i++) {
                const asset = data[i];
                tableContents.push([
                    asset.clientAssetId,
                    asset.categoryId,
                    asset.locationId,
                    asset.manufacturer,
                    asset.model,
                    asset.statusId
                ]);
            }

            dataTable.setData(tableContents, tableHeaders);
        }

        createPagination() {
            const _document = this.getDocument();
            const footer = _document.createElement('div');
            footer.classList.add('docking-panel-footer');
            this.container.appendChild(footer);

            const pagination = _document.createElement('div');
            pagination.classList.add('docking-panel-pagination');
            footer.appendChild(pagination);
            this.pagination = pagination;

            const prevPageButton = _document.createElement('a');
            prevPageButton.classList.add('disabled');
            prevPageButton.innerText = '❮';
            prevPageButton.href = '#';
            pagination.appendChild(prevPageButton);
            this.prevPageButton = prevPageButton;

            const nextPageButton = _document.createElement('a');
            nextPageButton.classList.add('disabled');
            nextPageButton.innerText = '❯';
            prevPageButton.href = '#';
            pagination.appendChild(nextPageButton);
            this.nextPageButton = nextPageButton;
        }

        updatePageButton(button, pagination) {
            if (pagination && pagination.nextUrl) {
                button.href = pagination.nextUrl;
                button.classList.remove('disabled');
                button.onclick = async (event) => {
                    event.preventDefault();
                    console.log(event);

                    await this.updateDataTable(pagination.cursorState);
                    this.updatePagination();
                };
            } else {
                button.href = '#';
                button.classList.add('disabled');
                button.onclick = null;
            }
        }

        updatePagination() {
            if (!this.assets || !this.assets.pagination)
                return;

            this.updatePageButton(this.prevPageButton, this.prevPagination);
            this.updatePageButton(this.nextPageButton, this.assets.pagination);
        }
    }

    class BIM360AssetInfoPanel extends Autodesk.Viewing.Extensions.ViewerPropertyPanel {
        constructor(viewer) {
            super(viewer);
        }

        async getAssetInfo(assetId) {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const users = await this.getRemoteAssetInfo(data.hubId, data.projectId, assetId);
                    resolve(users);
                    console.log(users);
                } catch (ex) {
                    reject(new Error(ex));
                }
            });
        }

        async getRemoteAssetInfo(accountId, projectId, assetId) {
            return new Promise((resolve, reject) => {
                fetch(`/api/forge/bim360/account/${accountId}/project/${projectId}/assets/${assetId}`, {
                    method: 'get',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return reject(new Error(response.statusText));
                        }
                    })
                    .then((data) => {
                        if (!data) return reject(new Error('Failed to fetch asset info from the server'));

                        return resolve(data);
                    })
                    .catch((error) => reject(new Error(error)));
            });
        }

        async getAssetId(dbId) {
            return new Promise((resolve, reject) => {
                this.currentModel.getProperties(
                    dbId,
                    (result) => resolve(result.externalId),
                    (error) => reject(error)
                );
            });
        }

        async formatProps(dbId) {
            const assetId = await this.getAssetId(dbId);
            const result = await this.getRemoteAssetInfo(accountId, projectId, assetId);

            const props = [];
            for (let i = 0; i < result.length; ++i) {
                const data = result[i];
                props.push({
                    attributeName: data.name,
                    displayCategory: data.category,
                    displayName: data.displayName,
                    displayValue: data.value,
                    hidden: 0,
                    precision: 0,
                    type: data.dataType.serial,
                    units: null
                });
            }

            return {
                dbId,
                name: `Asset [${result.clientAssetId}]`,
                externalId: result.id,
                properties: props
            };
        }

        async requestNodeProperties(dbId) {
            this.propertyNodeId = dbId;

            if (!this.viewer) return;

            try {
                const result = await this.formatProps(dbId);

                this.setTitle(result.name, { localizeTitle: true });
                this.setProperties(result.properties);

                this.resizeToContent();

                if (this.isVisible()) {
                    const toolController = this.viewer.toolController,
                        mx = toolController.lastClickX,
                        my = toolController.lastClickY,
                        panelRect = this.container.getBoundingClientRect(),
                        px = panelRect.left,
                        py = panelRect.top,
                        pw = panelRect.width,
                        ph = panelRect.height,
                        canvasRect = this.viewer.canvas.getBoundingClientRect(),
                        cx = canvasRect.left,
                        cy = canvasRect.top,
                        cw = canvasRect.width,
                        ch = canvasRect.height;

                    if ((px <= mx && mx < px + pw) && (py <= my && my < py + ph)) {
                        if ((mx < px + (pw / 2)) && (mx + pw) < (cx + cw)) {
                            this.container.style.left = Math.round(mx - cx) + 'px';
                            this.container.dockRight = false;
                        } else if (cx <= (mx - pw)) {
                            this.container.style.left = Math.round(mx - cx - pw) + 'px';
                            this.container.dockRight = false;
                        } else if ((mx + pw) < (cx + cw)) {
                            this.container.style.left = Math.round(mx - cx) + 'px';
                            this.container.dockRight = false;
                        } else if ((my + ph) < (cy + ch)) {
                            this.container.style.top = Math.round(my - cy) + 'px';
                            this.container.dockBottom = false;
                        } else if (cy <= (my - ph)) {
                            this.container.style.top = Math.round(my - cy - ph) + 'px';
                            this.container.dockBottom = false;
                        }
                    }
                }
            } catch (error) {
                this.showDefaultProperties();
            }
        }
    }

    class BIM360AssetExtension extends Autodesk.Viewing.Extension {
        constructor(viewer, options) {
            super(viewer, options);

            this.panel = null;
            this.createUI = this.createUI.bind(this);
            this.onToolbarCreated = this.onToolbarCreated.bind(this);
        }

        onToolbarCreated() {
            this.viewer.removeEventListener(
                Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
                this.onToolbarCreated
            );

            this.createUI();
        }

        createUI() {
            const viewer = this.viewer;

            const assetListPanel = new BIM360AssetListPanel(viewer, 'Assets');
            viewer.addPanel(assetListPanel);
            this.assetListPanel = assetListPanel;

            const assetInfoPanel = new BIM360AssetInfoPanel(viewer);
            viewer.addPanel(assetInfoPanel);
            this.assetInfoPanel = assetInfoPanel;

            const assetListButton = new Autodesk.Viewing.UI.Button('toolbar-bim360AssetList');
            assetListButton.setToolTip('Asset List');
            assetListButton.icon.classList.add('glyphicon');
            assetListButton.icon.classList.add('glyphicon-bim360-icon');
            assetListButton.setIcon('glyphicon-list-alt');
            assetListButton.onClick = function () {
                assetListPanel.setVisible(!assetListPanel.isVisible());
            };

            const assetInfoButton = new Autodesk.Viewing.UI.Button('toolbar-bim360AssetInfo');
            assetInfoButton.setToolTip('Asset Info');
            assetInfoButton.setIcon('adsk-icon-properties');
            assetInfoButton.onClick = function () {
                assetInfoPanel.setVisible(!assetInfoPanel.isVisible());
            };

            assetListPanel.addVisibilityListener(function (visible) {
                if (visible)
                    viewer.onPanelVisible(assetListPanel, viewer);

                assetListButton.setState(visible ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            });

            assetInfoPanel.addVisibilityListener(function (visible) {
                if (visible)
                    viewer.onPanelVisible(assetInfoPanel, viewer);

                assetInfoButton.setState(visible ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            });

            const subToolbar = new Autodesk.Viewing.UI.ControlGroup('toolbar-bim360-tools');
            subToolbar.addControl(assetListButton);
            subToolbar.addControl(assetInfoButton);
            subToolbar.assetListButton = assetListButton;
            subToolbar.assetInfoButton = assetInfoButton;
            this.subToolbar = subToolbar;

            viewer.toolbar.addControl(this.subToolbar);
        }

        load() {
            if (this.viewer.toolbar) {
                // Toolbar is already available, create the UI
                this.createUI();
            } else {
                // Toolbar hasn't been created yet, wait until we get notification of its creation
                this.viewer.addEventListener(
                    Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
                    this.onToolbarCreated
                );
            }

            return true;
        }

        unload() {
            if (this.assetListPanel) {
                this.viewer.removePanel(this.assetListPanel);
                this.assetListPanel.uninitialize();
                delete this.assetListPanel;
                this.assetListPanel = null;
            }

            if (this.assetInfoPanel) {
                this.viewer.removePanel(this.assetInfoPanel);
                this.assetInfoPanel.uninitialize();
                delete this.assetInfoPanel;
                this.assetInfoPanel = null;
            }

            if (this.subToolbar) {
                this.viewer.toolbar.removeControl(this.subToolbar);
                delete this.subToolbar;
                this.subToolbar = null;
            }

            return true;
        }
    }

    Autodesk.Viewing.theExtensionManager.registerExtension('BIM360AssetExtension', BIM360AssetExtension);

    // *******************************************
    // Helper functions
    // *******************************************
    function getSelectedNode() {
        var node = $('#userHubs').jstree(true).get_selected(true)[0];
        var parent;
        for (var i = 0; i < node.parents.length; i++) {
            var p = node.parents[i];
            if (p.indexOf('hubs') > 0 && p.indexOf('projects') > 0) parent = p;
        }

        if (node.id.indexOf('|') > -1) { // Plans folder
            var params = node.id.split("|");
            return { 'project': parent, 'urn': params[0], 'version': params[3] };
        }
        else { // other folders
            for (var i = 0; i < node.parents.length; i++) {
                var parent = node.parents[i];
                if (parent.indexOf('hubs') > 0 && parent.indexOf('projects') > 0) {
                    var version = atob(node.id.replace('_', '/')).split('=')[1]
                    return { 'project': parent, 'urn': (node.type == 'versions' ? id(node.parents[0]) : ''), version: version };
                }
            }
        }
        return null;
    }

    function id(href) {
        return href.substr(href.lastIndexOf('/') + 1, href.length);
    }

    function stringOrEmpty(str) {
        if (str == null) return '';
        return str;
    }
})();
