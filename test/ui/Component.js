sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel'
], function (UIComponent, JSONModel) {
    'use strict';
    return UIComponent.extend('webapp.Component', {

        metadata : {
            manifest: "json"
        },

        init: function () {
            // вызвать функцию инициализации родителя
            UIComponent.prototype.init.apply(this, arguments);

            // применяем модель с данными oData к view
            let oData = {
                recipient : {
                    name : 'World'
                }
            };
            let oModel = new JSONModel(oData);
            this.setModel(oModel);
        }

    });
});