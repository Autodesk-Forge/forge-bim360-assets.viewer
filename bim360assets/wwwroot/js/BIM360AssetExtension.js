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

            super(viewer.container, viewer.container.id + 'BIM360AssetListPanel', title, options);

            this.container.classList.add('bim360-docking-panel');
            this.container.classList.add('bim360-asset-list-panel');
            this.createScrollContainer(options);

            this.viewer = viewer;
            this.options = options;
            this.uiCreated = false;

            this.addVisibilityListener(async (show) => {
                if (!show) return;

                if (!this.uiCreated)
                    await this.createUI();
            });
        }

        async getAssets() {
            return new Promise(async (resolve, reject) => {
                const selected = getSelectedNode();
                try {
                    const data = await this.getHqProjectId(selected.project);
                    const assets = await this.getRemoteAssets(data.hubId, data.projectId);
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

        async getRemoteAssets(accountId, projectId) {
            return new Promise((resolve, reject) => {
                fetch(`/api/forge/bim360/account/${accountId}/project/${projectId}/assets`, {
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

            const table = document.createElement('table');
            table.className = 'adsk-lmv-tftable adn-lvl-section-panel-table';

            const tbody = document.createElement('tbody');
            table.appendChild(tbody);
            this.scrollContainer.appendChild(table);

            const assets = await this.getAssets();
            const data = assets.results;
            for (let i = 0; i < data.length; i++) {
                const asset = data[i];
                const row = tbody.insertRow(-1);
                const nameCell = row.insertCell(0);
                nameCell.innerText = asset.clientAssetId;
            }

            this.resizeToContent();
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
            this.panel = assetListPanel;

            const assetListButton = new Autodesk.Viewing.UI.Button('toolbar-bim360AssetList');
            assetListButton.setToolTip('Asset List');
            assetListButton.setIcon('adsk-icon-properties');
            assetListButton.onClick = function () {
                assetListPanel.setVisible(!assetListPanel.isVisible());
            };

            const subToolbar = new Autodesk.Viewing.UI.ControlGroup('toolbar-bim360-tools');
            subToolbar.addControl(assetListButton);
            subToolbar.assetListButton = assetListButton;
            this.subToolbar = subToolbar;

            viewer.toolbar.addControl(this.subToolbar);

            assetListPanel.addVisibilityListener(function (visible) {
                if (visible)
                    viewer.onPanelVisible(assetListPanel, viewer);

                assetListButton.setState(visible ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            });
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
            if (this.panel) {
                this.panel.uninitialize();
                delete this.panel;
                this.panel = null;
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
