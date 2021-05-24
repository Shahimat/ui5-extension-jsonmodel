sap.ui.define([

], (

) => {
  'use strict';

  return {
    init: async function (oComponent) {
      await oComponent.getModel('product').loadData('/test-resources/localservices/mockdata/Products.json');
    }
  };

});