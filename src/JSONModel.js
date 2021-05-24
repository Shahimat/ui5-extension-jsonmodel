sap.ui.define([
  'sap/ui/model/json/JSONModel'
], (
  JSONModel
) => {
  'use strict';

  const ExJSONModel = JSONModel.extend('libex.JSONModel', {

    metadata: {
      publicMethods: []
    },

    constructor: function (oData, bObserve, oSettings) {
      JSONModel.apply(this, arguments);
      if (!oSettings) {
        return;
      }
    }

  });

  return ExJSONModel;

});
