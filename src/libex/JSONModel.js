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
      publicMethods: ['addDataSourcesFromConfig', 'create', 'read', 'update', 'delete', 'setCurrent', 'getCurrent',
      'getChilds']
    },

    constructor: function (oSettings) {
      JSONModel.apply(this, []);

      // add new CRUD node
      this.crud = new CRUD('main', this);
      this.crud.setPointers(this);

      if (!oSettings || !oSettings.cfgPath) {
        console.warn('no settings or no cfgPath found for libex.JSONModel');
        return;
      }
      const that = {
        it: this,
        defaultDataSource: oSettings.defaultDataSource,
      };
      sap.ui.require([oSettings.cfgPath], function(aConfig) {
        this.it.addDataSourcesFromConfig(aConfig, this.defaultDataSource);
      }.bind(that));
    },

    addDataSourcesFromConfig: function (aConfig, sDefaultDS = undefined) {
      if (!aConfig || !Array.isArray(aConfig)) {
        console.warn('config not found');
        return;
      }
      aConfig.forEach(oCRUD => {
        if (!oCRUD.isComplexCRUD) {
          console.warn('the object is not complex CRUD');
          return;
        }
        this.crud.addComplexCRUD(oCRUD);
      });
      this.crud.setContext(this);
      this.setCurrent('production', true);
      if (sDefaultDS) {
        this.setCurrent(sDefaultDS);
      }
    },

    setCurrent: function (sName, bAll) {
      this.crud.setCurrent(sName, bAll);
    },

    getCurrent: function () {
      return this.crud.getCurrent();
    },

    getChilds: function () {
      return this.crud.getChilds();
    }

  });

  return ExJSONModel;

});
