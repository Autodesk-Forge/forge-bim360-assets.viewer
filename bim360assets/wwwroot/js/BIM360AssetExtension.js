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
    /*class DataTable extends Autodesk.Viewing.UI.DataTable {
        constructor(dockingPanel) {
            super(dockingPanel);
        }

        clearContent() {
            while (this.datatableDiv.firstChild) {
                this.datatableDiv.removeChild(this.datatableDiv.lastChild);
            }
        }
    }*/

    class BIM360DataProvider {
        constructor() {
            this.users = null;
            this.statuses = null;
            this.categories = null;
            this.customAttrDefs = null;
            this.locations = null;
        }

        dispose() {
            while (this.users.length > 0) {
                this.users.pop();
            }
            while (this.statuses.length > 0) {
                this.statuses.pop();
            }
            while (this.categories.length > 0) {
                this.categories.pop();
            }
            while (this.customAttrDefs.length > 0) {
                this.customAttrDefs.pop();
            }
            while (this.locations.length > 0) {
                this.locations.pop();
            }

            this.users = null;
            this.statuses = null;
            this.categories = null;
            this.customAttrDefs = null;
            this.locations = null;
        }

        async fetchData() {
            try {
                this.users = await this.getUsers();
                this.statuses = await this.getAssetStatuses();
                this.categories = await this.getAssetCategories();
                this.customAttrDefs = await this.getAssetCustomAttributeDefs();
                this.locations = await this.getLocations();
            } catch (ex) {
                console.warn(`[BIM360DataProvider]: ${ex}`);
            }
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

        async getUsers() {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const users = await this.getRemoteUsers(data.hubId, data.projectId);
                    const userMap = {};
                    for (let i = 0; i < users.length; i++) {
                        const user = users[i];
                        userMap[user.uid] = user;
                    }
                    resolve(userMap);
                    console.log(userMap);
                } catch (ex) {
                    reject(ex);
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
                                new Error(`Failed to fetch BIM360 users from server (status: ${response.status}, message: ${response.statusText})`)
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

        buildTreeBreadCrumbs(tree) {
            // function walk(node, name) {
            //     if (node.subcategories !== undefined) {
            //         node.subcategories.forEach(function (child) {
            //             name += ` > ${walk(child, child.name)}`;
            //         });
            //     }

            //     return name;
            // }

            // return walk(tree, tree.name);

            const breadcrumbs = [];
            function traverse(node, path) {
                if (!path)
                    path = [];
                if (node.name) {
                    path.push({ id: node.id, path: node.name })
                }
                breadcrumbs.push(path);
                if (node.subcategories) {
                    node.subcategories.forEach(function (item) {
                        traverse(item, path.slice());
                    });
                }
                if (node.children) {
                    node.children.forEach(function (item) {
                        traverse(item, path.slice());
                    });
                }
            }
            traverse(tree, []);

            return breadcrumbs.map(b => {
                const last = b[b.length - 1];
                const breadcrumb = b.map(s => s.path).join(' > ');
                return { id: last.id, breadcrumb };
            });//.reduce((accumulator, val) => accumulator.concat(val), []);
        }

        async getAssetCategories() {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const cates = await this.getRemoteAssetCategories(data.hubId, data.projectId);

                    const result = [];
                    for (let i = 0; i < cates.length; i++) {
                        const cate = cates[i];
                        result.push(this.buildTreeBreadCrumbs(cate));
                    }

                    const flattenResult = result.reduce((accumulator, val) => accumulator.concat(val), []);
                    const breadcrumbs = {};
                    for (let i = 0; i < flattenResult.length; i++) {
                        const data = flattenResult[i];
                        breadcrumbs[data.id] = data.breadcrumb;
                    }
                    console.log(breadcrumbs);
                    resolve(breadcrumbs);
                } catch (ex) {
                    reject(new Error(ex));
                }
            });
        }

        async getRemoteAssetCategories(accountId, projectId) {
            return new Promise((resolve, reject) => {
                fetch(`/api/forge/bim360/account/${accountId}/project/${projectId}/asset-categories?buildTree=true`, {
                    method: 'get',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return reject(
                                new Error(`Failed to fetch BIM360 Asset categories from server (status: ${response.status}, message: ${response.statusText})`)
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

        async getAssetStatuses() {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const statuses = await this.getRemoteAssetStatuses(data.hubId, data.projectId);
                    const statusMap = {};
                    for (let i = 0; i < statuses.length; i++) {
                        const status = statuses[i];
                        for (let j = 0; j < status.values.length; j++) {
                            const subStatus = status.values[j];
                            statusMap[subStatus.id] = subStatus;
                        }
                    }

                    console.log(statusMap);
                    resolve(statusMap);
                } catch (ex) {
                    reject(new Error(ex));
                }
            });
        }

        async getRemoteAssetStatuses(accountId, projectId) {
            return new Promise((resolve, reject) => {
                fetch(`/api/forge/bim360/account/${accountId}/project/${projectId}/asset-statuses`, {
                    method: 'get',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return reject(
                                new Error(`Failed to fetch BIM360 Asset statuses from server (status: ${response.status}, message: ${response.statusText})`)
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

        async getLocations() {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const locations = await this.getRemoteLocations(`b.${data.hubId}`, `b.${data.projectId}`);

                    const result = [];
                    for (let i = 0; i < locations.length; i++) {
                        const loc = locations[i];
                        result.push(this.buildTreeBreadCrumbs(loc));
                    }

                    const flattenResult = result.reduce((accumulator, val) => accumulator.concat(val), []);
                    const breadcrumbs = {};
                    for (let i = 0; i < flattenResult.length; i++) {
                        const data = flattenResult[i];
                        breadcrumbs[data.id] = data.breadcrumb;
                    }
                    console.log(breadcrumbs);
                    resolve(breadcrumbs);
                } catch (ex) {
                    reject(new Error(ex));
                }
            });
        }

        async getRemoteLocations(accountId, projectId) {
            return new Promise((resolve, reject) => {
                fetch(`/api/forge/bim360/account/${accountId}/project/${projectId}/locations?buildTree=true`, {
                    method: 'get',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return reject(
                                new Error(`Failed to fetch BIM360 Locations from server (status: ${response.status}, message: ${response.statusText})`)
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

        async getAssetCustomAttributeDefs() {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const customAttrDefs = await this.getRemoteAssetCustomAttributeDefs(data.hubId, data.projectId);
                    const customAttrDefMap = {};

                    for (let i = 0; i < customAttrDefs.length; i++) {
                        const attrDef = customAttrDefs[i];
                        customAttrDefMap[attrDef.name] = attrDef;
                    }
                    console.log(customAttrDefMap);
                    resolve(customAttrDefMap);
                } catch (ex) {
                    reject(new Error(ex));
                }
            });
        }

        async getRemoteAssetCustomAttributeDefs(accountId, projectId) {
            return new Promise((resolve, reject) => {
                fetch(`/api/forge/bim360/account/${accountId}/project/${projectId}/asset-custom-attr-defs`, {
                    method: 'get',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return reject(
                                new Error(`Failed to fetch BIM360 Asset Custom Attribute Definitions from server (status: ${response.status}, message: ${response.statusText})`)
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

        mapAttributeType(val) {
            const type = typeof (val);
            let viewerAttributeType = 0;

            if (type === 'boolean') {
                viewerAttributeType = 1;
            } else if (type === 'number') {
                if (val % 1 === 0) {
                    viewerAttributeType = 2;
                } else {
                    viewerAttributeType = 3;
                }
            } else if (type === 'string') {
                viewerAttributeType = 20;
            } else {
                viewerAttributeType = 0;
            }

            return viewerAttributeType;
        }

        mapIdToName(asset) {
            const createdByUser = this.users[asset.createdBy];
            const updatedByUser = this.users[asset.updatedBy]
            const deletedByUser = this.users[asset.deletedBy];
            const installedByUser = this.users[asset.installedBy];
            const status = this.statuses[asset.statusId];
            const category = this.categories[asset.categoryId];
            const location = this.locations[asset.locationId];

            asset.createdByUser = createdByUser ? createdByUser.name : '';
            asset.updatedByUser = updatedByUser ? updatedByUser.name : '';
            asset.deletedByUser = deletedByUser ? deletedByUser.name : '';
            asset.installedByUser = installedByUser ? installedByUser.name : '';
            asset.status = status ? status.label : '';
            asset.category = category || '';
            asset.location = location || '';
        }

        flatCustomAttributes(data) {
            const props = [];
            for (let attrName in data) {
                const attrVal = data[attrName];
                const attrDef = this.customAttrDefs[attrName];
                const attrType = this.mapAttributeType(attrVal);
                const prop = {
                    attributeName: attrName,
                    displayCategory: "Custom",
                    displayName: attrDef.displayName,
                    displayValue: attrVal,
                    hidden: 0,
                    precision: 0,
                    type: attrType,
                    units: null
                };
                props.push(prop);
            }
            return props;
        }

        flatProperties(data) {
            this.mapIdToName(data);

            const props = [];
            for (let attrName in data) {
                const attrVal = data[attrName];

                if (attrName === 'customAttributes') {
                    let flattenCustomAttrs = this.flatCustomAttributes(attrVal);
                    props.push(...flattenCustomAttrs);
                    continue;
                }

                const isHidden = (attrName.toLowerCase().endsWith('id') || attrName.toLowerCase().endsWith('by')) ? 1 : 0;
                const attrType = this.mapAttributeType(attrVal);
                const prop = {
                    attributeName: attrName,
                    displayCategory: 'Built In',
                    displayName: attrName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
                    displayValue: attrVal,
                    hidden: isHidden,
                    precision: 0,
                    type: attrType,
                    units: null
                };
                props.push(prop);
            }
            return props;
        }

        async getAssetInfo(assetId) {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const asset = await this.getRemoteAssetInfo(data.hubId, data.projectId, assetId);
                    const props = {
                        id: asset.id,
                        externalId: asset.clientAssetId,
                        properties: this.flatProperties(asset)
                    };
                    resolve(props);
                    //console.log(asset, props);
                } catch (ex) {
                    reject(ex);
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

        async getAssets(cursorState, limit) {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const assetData = await this.getRemoteAssets(data.hubId, data.projectId, cursorState, limit);
                    const assets = assetData.results;
                    for (let i = 0; i < assets.length; i++) {
                        const asset = assets[i];
                        this.mapIdToName(asset);
                    }

                    //console.log(assetData);
                    resolve(assetData);
                } catch (ex) {
                    reject(new Error(ex));
                }
            });
        }

        async getRemoteAssets(accountId, projectId, cursorState, limit) {
            return new Promise((resolve, reject) => {
                let query = '';
                if (limit) {
                    query += `pageLimit=${limit}`
                } else {
                    // Todo: fix back previous bug 
                    // Todo: check cursorState meaning with asset team, current cursorState is the same with nextUrl
                    query += 'pageLimit=3'
                    //query += 'pageLimit=5'
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

        async getAssetId(dbId, model) {
            return new Promise((resolve, reject) => {
                function onSuccess(result) {
                    if (!result || result.length <= 0) {
                        resolve(null);
                    } else {
                        const data = result[0];
                        if (data.properties.length <= 0) {
                            resolve(data.externalId);
                        } else {
                            resolve(data.properties[0]);
                        }
                    }
                }

                function onError(error) {
                    reject(error)
                }

                model.getBulkProperties2(
                    [dbId],
                    { propFilter: ['Asset ID', 'externalId', 'name'] },
                    onSuccess,
                    onError
                );
            });
        }
    }

    class BIM360AssetListPanel extends Autodesk.Viewing.UI.DockingPanel {
        constructor(viewer, dataProvider) {
            const options = {};

            //  Height adjustment for scroll container, offset to height of the title bar and footer by default.
            if (!options.heightAdjustment)
                options.heightAdjustment = 70;

            if (!options.marginTop)
                options.marginTop = 0;

            options.addFooter = false;

            super(viewer.container, viewer.container.id + 'BIM360AssetListPanel', 'Assets', options);

            this.container.classList.add('bim360-docking-panel');
            this.container.classList.add('bim360-asset-list-panel');

            this.viewer = viewer;
            this.options = options;
            this.uiCreated = false;
            this.dataProvider = dataProvider;

            this.onSelectionChanged = this.onSelectionChanged.bind(this);

            this.addVisibilityListener(async (show) => {
                if (!show) return;

                if (!this.uiCreated)
                    await this.createUI();
            });
        }

        async onSelectionChanged(event) {
            if (!event.selections || event.selections.length <= 0)
                return;

            try {
                const dbIds = event.selections[0].dbIdArray;
                const model = event.selections[0].model;
                const dbId = dbIds[0];

                const assetId = await this.dataProvider.getAssetId(dbId, model);
                const tableRows = this.dataTable.datatableDiv.querySelectorAll('.clusterize-content tr');
                const data = this.assets.results;

                const idx = data.findIndex(a =>
                    a.id == assetId ||
                    a.clientAssetId == assetId ||
                    (a.customAttributes && Object.values(a.customAttributes).find(p => p.toString().includes(assetId)))
                );

                if (idx <= -1)
                    return;

                // Reset active state
                this.dataTable.datatableDiv.querySelectorAll('.clusterize-content tr.active').forEach(tr => tr.classList.remove('active'));
                tableRows[idx].classList.add('active');
            } catch (ex) {
                console.warn(`[BIM360AssetInfoPanel]: ${ex}`);
            }
        }

        uninitialize() {
            this.viewer.removeEventListener(
                Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
                this.onSelectionChanged
            );
        }

        async createUI() {
            this.uiCreated = true;
            const dataTable = new Autodesk.Viewing.UI.DataTable(this);
            dataTable._createRows();
            this.dataTable = dataTable;

            await this.updateDataTable();

            this.createPagination();
            this.updatePagination();

            this.viewer.addEventListener(
                Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
                this.onSelectionChanged
            );
        }

        clearDataTable() {
            const dataTable = this.dataTable;
            if (!dataTable) return;

            while (dataTable.datatableDiv.firstChild) {
                dataTable.datatableDiv.removeChild(dataTable.datatableDiv.lastChild);
            }
        }

        async getAssetViewerId(externalId) {
            try {
                const getExternalIdMapping = () => {
                    return new Promise((resolve, reject) => {
                        this.viewer.model.getExternalIdMapping(
                            map => resolve(map),
                            error => reject(new Error(error))
                        )
                    });
                };

                const extIdMap = await getExternalIdMapping();
                return extIdMap[externalId];
            } catch (ex) {
                console.warn(`[BIM360AssetInfoPanel]: ${ex}`);
                return null;
            }
        }

        async updateDataTable(cursorState, limit) {
            const dataTable = this.dataTable;
            if (!dataTable) return;

            const tableHeaders = ['Asset ID', 'Category', 'Location', 'Manufacturer', 'Model', 'Status'];
            const tableContents = [];
            const assets = await this.dataProvider.getAssets(cursorState, limit);
            if (!assets || assets.results.length <= 0)
                return;

            this.clearDataTable();

            // if (this.assets)
            //     this.prevPagination = this.assets.pagination;

            const data = assets.results;
            this.assets = assets;

            for (let i = 0; i < data.length; i++) {
                const asset = data[i];

                tableContents.push([
                    asset.clientAssetId,
                    asset.category,
                    asset.location,
                    asset.manufacturer,
                    asset.model,
                    asset.status
                ]);
            }

            dataTable.setData(tableContents, tableHeaders);

            const tableRows = dataTable.datatableDiv.querySelectorAll('.clusterize-content tr');

            for (let i = 0; i < tableRows.length; i++) {
                const asset = data[i];
                const tableRow = tableRows[i];

                tableRow.ondblclick = async (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    // Reset active state
                    dataTable.datatableDiv.querySelectorAll('.clusterize-content tr.active').forEach(tr => tr.classList.remove('active'));
                    event.target.parentElement.classList.add('active');

                    let dbId = null;

                    for (let attrName in asset.customAttributes) {
                        const attrDef = this.dataProvider.customAttrDefs[attrName];

                        if (attrDef.displayName !== 'External Id')
                            continue;

                        const attrVal = asset.customAttributes[attrName];
                        dbId = await this.getAssetViewerId(attrVal);
                    }

                    this.viewer.clearSelection();

                    if (!dbId) {
                        alert(`No External Id value found for Asset \`${asset.clientAssetId}\`!`)
                    } else {
                        this.viewer.fitToView();
                        this.viewer.select(dbId);
                        this.viewer.isolate(dbId);
                        this.viewer.fitToView([dbId]);
                    }

                    console.log(`Asset \`${asset.clientAssetId}\` clicked!`, asset);
                };

                const tdIdx = [2, 3];
                for (let j = 0; j < tdIdx.length; j++) {
                    const categoryCell = tableRow.querySelector(`td:nth-child(${tdIdx[j]})`);
                    categoryCell.setAttribute('title', categoryCell.innerText);
                }
            }
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

        updatePageButton(button, url) {
            if (url) {
                button.href = url;
                button.classList.remove('disabled');
                button.onclick = async (event) => {
                    event.preventDefault();
                    console.log(event);

                    const urlObj = new URL(url);
                    const urlParams = urlObj.searchParams;
                    const cursorState = urlParams.get('cursorState');
                    const limit = urlParams.get('limit');

                    await this.updateDataTable(cursorState, limit);
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

            this.updatePageButton(this.prevPageButton, this.assets.pagination.previousUrl);
            this.updatePageButton(this.nextPageButton, this.assets.pagination.nextUrl);
        }
    }

    class BIM360AssetInfoPanel extends Autodesk.Viewing.Extensions.ViewerPropertyPanel {
        constructor(viewer, dataProvider) {
            super(viewer);

            this.dataProvider = dataProvider;

            this.addVisibilityListener((show) => {
                if (!show) return;

                if (!this.currentModel) {
                    super.showDefaultProperties();
                    this.setTitle('Unknown Asset', { localizeTitle: true });
                }
            });
        }

        async formatProps(dbId) {
            try {
                const assetId = await this.dataProvider.getAssetId(dbId, this.currentModel);
                const result = await this.dataProvider.getAssetInfo(assetId);

                return {
                    dbId,
                    name: `Asset [${result.externalId}]`,
                    externalId: result.id,
                    properties: result.properties
                };
            } catch (ex) {
                console.warn(`[BIM360AssetInfoPanel]: ${ex}`);
                return null;
            }
        }

        showDefaultProperties(dbId) {
            this.setTitle('Unknown Asset', { localizeTitle: true });
            this.showNoProperties();
            this.resizeToContent();
        }

        async requestNodeProperties(dbId) {
            this.propertyNodeId = dbId;

            if (!this.viewer) return;

            try {
                const result = await this.formatProps(dbId);
                if (!result) {
                    this.currentModel = null;
                    this.currentNodeIds = [];
                    throw new Error(`No Asset info for dbId: ${dbId}`);
                }

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

            const dataProvider = new BIM360DataProvider();
            this.dataProvider = dataProvider;

            this.assetListPanel = null;
            this.assetInfoPanel = null;
            this.createUI = this.createUI.bind(this);
            this.onToolbarCreated = this.onToolbarCreated.bind(this);
        }

        onToolbarCreated() {
            this.createUI();
        }

        createUI() {
            const viewer = this.viewer;

            const assetListPanel = new BIM360AssetListPanel(viewer, this.dataProvider);
            viewer.addPanel(assetListPanel);
            this.assetListPanel = assetListPanel;

            const assetInfoPanel = new BIM360AssetInfoPanel(viewer, this.dataProvider);
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
            }

            // Pre-fetch necessary data for assets
            this.dataProvider.fetchData();

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

            if (this.dataProvider) {
                this.dataProvider.dispose();
                delete this.dataProvider;
                this.dataProvider = null;
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
