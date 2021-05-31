sap.ui.define([
  'libex/patterns/CRUDdev'
], (
  CRUDdev
) => {
  'use strict';
  
  return [

    new CRUDdev('develop', {
      uri: '',
    }, 
    [
      {
        type: 'create',
        pattern: /^\/$/,
        task: (oContext) => {
          if (!oContext.params || !oContext.params.ProductName || !oContext.params.UnitPrice) {
            console.warn('Params not found');
          }
          let aData = oContext.model.getProperty(`${oContext.serviceURI}/`);
          let nIndex = aData.length;
          let oData = {
            ProductID: aData[nIndex - 1]? aData[nIndex - 1].ProductID + 1: 0,
            ProductName: oContext.params.ProductName,
            UnitPrice: oContext.params.UnitPrice
          }
          oContext.model.setProperty(`${oContext.serviceURI}/${nIndex}`, oData);
          return oData;
        }
      },
      {
        type: 'read',
        pattern: /^\/$/,
        task: (oContext) => {
          return oContext.model.getProperty(`${oContext.serviceURI}/`);
        }
      },
      {
        type: 'read',
        pattern: /^\/(\d+)$/,
        task: (oContext) => {
          let ProductID = Number(oContext.patternMatched[1]);
          let aData = oContext.model.getProperty(`${oContext.serviceURI}/`);
          let nIndex = aData.findIndex(oItem => oItem.ProductID === ProductID);
          if (!nIndex || nIndex < 0) {
            console.warn(`ProductID "${ProductID}" not found`);
            return;
          }
          return oContext.model.getProperty(`${oContext.serviceURI}/${nIndex}`);
        }
      },
      {
        type: 'update',
        pattern: /^\/$/,
        task: (oContext) => {
          if (!oContext.params || !oContext.params.ProductName || !oContext.params.UnitPrice) {
            console.warn('Params not found');
          }
          let ProductID = oContext.params.ProductID;
          let aData = oContext.model.getProperty(`${oContext.serviceURI}/`);
          let nIndex = aData.findIndex(oItem => oItem.ProductID === ProductID);
          if (!nIndex || nIndex < 0) {
            console.warn(`ProductID "${ProductID}" not found`);
            return;
          }
          let oData = aData[nIndex];
          oData.ProductName = oContext.params.ProductName;
          oData.UnitPrice = oContext.params.UnitPrice;
          oContext.model.setProperty(`${oContext.serviceURI}/${nIndex}`, oData);
          return oData;
        }
      },
      {
        type: 'delete',
        pattern: /^\/(\d+)$/,
        task: (oContext) => {
          let aData = oContext.model.getProperty(`${oContext.serviceURI}/`);
          let ProductID = Number(oContext.patternMatched[1]);
          aData = aData.filter(oItem => oItem.ProductID !== ProductID);
          oContext.model.setProperty(`${oContext.serviceURI}/`, aData);
        }
      }
    ])

  ];

});
