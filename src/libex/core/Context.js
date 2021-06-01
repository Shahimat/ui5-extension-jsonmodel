/**
 * 
 */
 sap.ui.define([
  'sap/ui/base/Object'
], (
  Object
) => {
  'use strict';

  const Context = Object.extend('libex.core.Context', {

    metadata: {
      publicMethods: []
    },

    constructor: function (any) {
      Object.call(this);
      this.newContext(any);
    },

    clearContext: function () {
      for (let key in this) {
        delete this[key];
      }
    },

    newContext: function (anySimpleObject) {
      this.clearContext();
      if (!this._checkIsSimpleObj(anySimpleObject)) {
        return;
      }
      this.addObjectContext(anySimpleObject);
    },

    addFieldContext: function (sField, any) {
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
      this[sField] = copyJS(any);
    },

    clearFieldContext: function (sField) {
      delete this[sField];
    },

    addObjectContext: function (jsSimpleObj) {
      if (!this._checkIsSimpleObj(jsSimpleObj)) {
        return;
      }
      for (let key in jsSimpleObj) {
        delete this[key];
        this.addFieldContext(key, jsSimpleObj[key]);
      }
    },

    /* Check's */

    _checkIsSimpleObj: function (value) {
      if (value && typeof(value) === 'object') {
        if (value.contructor) {
          if (value.contructor.name === 'Object') {
            return true;
          }
          console.warn('value is not a simple object');
          return false;
        }
        return true;
      }
      console.warn('value is not a simple object');
      return false;
    }

  });

  return Context;

});