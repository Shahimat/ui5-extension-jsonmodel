 sap.ui.define([
  'libex/core/SimpleObject'
], (
  SimpleObject
) => {
  'use strict';

  return SimpleObject({

    getJSON: function (sText) {
      let data;
      try {
        data = JSON.parse(sText);
      } catch (error) {
        return undefined;
      }
      return data;
    },

    fetch: async function (oContext) {
      if (oContext.req && oContext.body) {
        oContext.req.body = oContext.body; 
      }
      let oRes = await fetch(oContext.fullUri, oContext.req);
      let sText = await oRes.text();
      oContext.addFieldContext('oData', this.getJSON(sText));
    },

  });

});