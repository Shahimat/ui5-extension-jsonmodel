sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/ui/model/Sorter',
    'libex/JSONModel',
    'sap/ui/core/BusyIndicator',
 ], function (Controller, MessageToast, Sorter, ExJSONModel, BusyIndicator) {
    'use strict';
    return Controller.extend('webapp.controller.App', {

        productSelectedItem: null,

        onInit: function () {
            this.model = this.getView().getModel('product');
            this.onUpdateFrontendModelFromBack();
        },

        onSelectionChange: function (oEvent) {
            if (!oEvent) {
                this.productSelectedItem = null;
                this.byId('productTable').removeSelections();
                return;
            }
            let aItemCells = oEvent.getParameter('listItem').getCells();
            this.productSelectedItem = Number(aItemCells[0].getValue());
        },

        onUpdateFrontendModelFromBack: function () {
            BusyIndicator.show(0);
            return this.model.read('/').then(oData => {
                BusyIndicator.hide();
                return this._nextPromiseChain();
            })
        },
        
        onCreate: function () {
            this.model.create('/', {
                ProductName: 'some',
                UnitPrice: 100
            }).then(() => {
                this.onUpdateFrontendModelFromBack();
            })
        },
        
        onChange: function () {
            if (this.productSelectedItem === null) {
                MessageToast.show('Ничего не выбрано');
                return;
            }
            this.model.read(`/${this.productSelectedItem}`).then((oData) => {
                oData.UnitPrice = oData.UnitPrice + 156;
                return this.model.update('/', oData);
            }).then(() => {
                this.onUpdateFrontendModelFromBack();
            })
        },
        
        onDelete: function () {
            if (this.productSelectedItem === null) {
                MessageToast.show('Ничего не выбрано');
                return;
            }
            this.model.delete(`/${this.productSelectedItem}`).then(() => {
                this.onSelectionChange();
                this.onUpdateFrontendModelFromBack();
            })
        },
        
        onSort: function () {

        },

        _nextPromiseChain: function (...args) {
            return new Promise((res, rej) => {
                res(...args);
            });
        },

    });
});