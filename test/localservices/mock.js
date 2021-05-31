sap.ui.define([
  'test/mockservices/Products'
], (
  Products
) => {
  'use strict';

  return {
    init: async function (oComponent) {
      let oModel = oComponent.getModel('product');
      await oModel.loadData('/test-resources/localservices/mockdata/Products.json');
      oModel.addComplexCRUD(Products);
    }
  };

});