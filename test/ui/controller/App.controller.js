sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/ui/model/Sorter'
 ], function (Controller, MessageToast, Sorter) {
    'use strict';
    return Controller.extend('webapp.controller.App', {

        productSelectedItem: null,

        onInit: function () {
            
        },

        onSelectionChange: function (oEvent) {
            if (!oEvent) {
                this.productSelectedItem = null;
                return;
            }
            let aItemCells = oEvent.getParameter('listItem').getCells();
            this.productSelectedItem = Number(aItemCells[0].getValue());
        },
        
        onCreate: function () {

        },
        
        onChange: function () {

        },
        
        onDelete: function () {

        },
        
        onSort: function () {

        }

     });
 });