/**
 * Класс, обеспечивающий интеграцию контекста и контекстных вызовов.
 * Определяет последовательность вызываемых функций, на вход которых принимается контекст, а на выходе способны мутировать
 * этот же контекст.
 */
sap.ui.define([
  'libex/CRUD'
], (
    CRUD
) => {
  'use strict';

  const CRUDfetch = CRUD.extend('libex.CRUDcontext', {

    metadata: {
      publicMethods: []
    },

    constructor: function (sName) {
      CRUD.apply(this, arguments);
      this._context = {};
      this._contextOperationsList    = [];
      this._contextCurrentOperations = undefined;
    },

    newContext: function (oDataDefault = undefined) {
      this.clearContext();
      if (oDataDefault) {
        this._copySimpleJSobject(this._context, oDataDefault);
      }
    },

    clearContext: function () {
      this._clearSimpleJSobject(this._context);
    },

    addToContext: function (sField, any) {
      this._context[sField] = any;
    },

    getContext: function () {
      return this._context;
    },

    clearContextOperations: function () {
      this._contextOperationsList = [];
    },

    addContextOperations: function (oContextOperations) {
      if (!this._checkContextOperationsList(oContextOperations)) {
        return;
      }
      this._contextOperationsList.push(oContextOperations);
    },

    getContextOperationsList: function () {
      return this._contextOperationsList;
    },

    setContextOperations: function (oContextOperations) {
      this._contextCurrentOperations = oContextOperations;
    },

    runContextOperations: async function () {
      if (!this._contextCurrentOperations) {
        console.warn('contextCurrentOperations not found');
        return;
      }
      for (let i = 0; i < this._contextCurrentOperations.operations.length; i++) {
        let oOperation = this._contextCurrentOperations.operations[i];
        switch (oOperation.type) {
          case 'field':
            if (oOperation.field) {
              this._context[oOperation.field] = oOperation.operation(this._context);
            } else {
              oOperation.operation(this._context);
            }
          case 'custom':
            if (oOperation.field) {
              this._context[oOperation.field] = await oOperation.operation(this._context);
            } else {
              await oOperation.operation(this._context);
            }
        }
      };
      return this._nextPromiseChain(this._context);
    },

    _clearSimpleJSobject: function (jsObj) {
      for (let key in jsObj) {
        delete jsObj[key];
      }
    },

    _copySimpleJSfield: function (jsObj, sField, any) {
      const copyJS = (any) => {
        let oRes;
        if (Array.isArray(any)) {
          oRes = [];
          any.forEach(anyItem => {
            oRes.push(copyJS(anyItem));
          });
          return oRes;
        }
        return any;
      }
      jsObj[sField] = copyJS(any);
    },

    _copySimpleJSobject: function (jsObj, jsObjCopied) {
      if (!typeof(jsObj) === 'object' || !typeof(jsObjCopied) === 'object') {
        console.warn('jsObj or jsObjCopied are not objects');
        return;
      }
      for (let key in jsObjCopied) {
        delete jsObj[key];
        this._copySimpleJSfield(jsObj, key, jsObjCopied[key]);
      }
    },

    _nextPromiseChain: function (...args) {
      return new Promise((res, rej) => {
        res(...args);
      });
    },

    /* Check's */

    _checkContextOperationsList: function (aContextOperationsList) {
      if (!aContextOperationsList || !aContextOperationsList.operations ||
      !Array.isArray(aContextOperationsList.operations)) {
        console.warn('aContextOperationsList not found. Structure: aContextOperationsList <object>: {operations: <array>}');
        return false;
      }
      const types = ['field', 'custom'];
      if (!aContextOperationsList.operations.every(oOperation => {
        return oOperation.type && typeof(oOperation.type) === 'string' && types.includes(oOperation.type) &&
        oOperation.operation && typeof(oOperation.operation) === 'function'
      })) {
        console.warn('Operation not found. Structure: { operation <function>, type <string> }');
        console.warn(`Allowed types: ${types.join(',')}`);
        return false;
      }
      return true;
    }

  });

  return CRUDfetch;

});
