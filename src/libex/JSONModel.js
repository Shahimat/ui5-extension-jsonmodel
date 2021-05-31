sap.ui.define([
  'sap/ui/model/json/JSONModel',
  'libex/CRUD'
], (
  JSONModel,
  CRUD
) => {
  'use strict';

  const ExJSONModel = JSONModel.extend('libex.JSONModel', {

    metadata: {
      publicMethods: [
        'create', 'read', 'update', 'delete', 'setCurrentCRUD', 'getCurrentCRUD', 'getChildsCRUD', 'getCRUD'
      ]
    },

    constructor: function (oSettings) {
      JSONModel.apply(this, []);

      // add new CRUD node
      this.crud = new CRUD('main');
      this.crud.setModel(this);
      this.crud.setPointers(/* oControl */this/*, default fields: [create, read, update, delete] */);

      if (!oSettings || !oSettings.cfgPath) {
        console.warn('no settings or no cfgPath found for libex.JSONModel');
        return;
      }
      sap.ui.require([oSettings.cfgPath], function(aCRUD) {
        if (aCRUD) {
          this.addComplexCRUD(aCRUD);
        }
      }.bind(this.crud));
    },

    addComplexCRUD: function (anyCRUD) {
      this.crud.addComplexCRUD(anyCRUD);
    },

    getRootCRUD: function () {
      return this.crud;
    },

    getCRUD: function (sName) {
      if (!sName) {
        console.warn(`CRUD "${sName}" not found`);
        return;
      }
      return this.crud.getCRUD(sName);
    },

    getCurrentCRUD: function () {
      return this.crud.getCurrent();
    },

    setCurrentCRUD: function (sName) {
      this.crud.setCurrent(sName);
    },

    getChildsCRUD: function () {
      return this.crud.getChilds();
    }

  });

  return ExJSONModel;

});
