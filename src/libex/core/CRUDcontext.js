/**
 * Класс, обеспечивающий интеграцию контекста и контекстных вызовов.
 * Определяет последовательность вызываемых функций, на вход которых принимается контекст, а на выходе способны мутировать
 * этот же контекст.
 */
sap.ui.define([
  'libex/core/CRUD',
  'libex/core/Context'
], (
    CRUD,
    Context
) => {
  'use strict';

  const CRUDfetch = CRUD.extend('libex.core.CRUDcontext', {

    metadata: {
      publicMethods: []
    },

    constructor: function (sName) {
      CRUD.apply(this, arguments);
      this._context = new Context();
      this._contextOperationsList    = [];
      this._contextCurrentOperations = undefined;
    },

    getContext: function () {
      return this._context;
    },

    clearContextOperations: function () {
      this._contextOperationsList = [];
    },

    addContextOperations: function (oContextOperations) {
      if (!this._checkContextOperations(oContextOperations)) {
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

    runContextOperations: function () { //async
      return new Promise(async function(res, rej) {
        if (!this._contextCurrentOperations) {
          let log = 'contextCurrentOperations not found';
          console.warn(log);
          rej(log);
          return;
        }
        for (let i = 0; i < this._contextCurrentOperations.operations.length; i++) {
          let oOperation = this._contextCurrentOperations.operations[i];
          let any;
          switch (oOperation.constructor.name) {
            case 'Function':
              any = oOperation(this._context);
              break;
            case 'AsyncFunction':
              any = await oOperation(this._context);
              break;
          }
          if (any !== undefined) {
            this._context.addFieldContext(oOperation.name, any);
          }
        };
        res(this._context);
      }.bind(this));
    },

    /* Check's */

    _checkContextOperations: function (oContextOperations) {
      if (!oContextOperations || !oContextOperations.operations ||
      !Array.isArray(oContextOperations.operations)) {
        console.warn('oContextOperations not found. Structure: oContextOperations <object>: {operations: <array of functions>}');
        return false;
      }
      if (!oContextOperations.operations.every(fOperation => {
        return fOperation && typeof(fOperation) === 'function'
      })) {
        console.warn('Operation not found <function>.');
        return false;
      }
      return true;
    }

  });

  return CRUDfetch;

});
