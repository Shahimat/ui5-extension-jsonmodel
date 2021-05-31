/**
 * Класс, определяющий базовые методы работы со стандартными fetch вызовами.
 */
sap.ui.define([
  'libex/CRUDcontext'
], (
  CRUDcontext
) => {
  'use strict';

  const CRUDfetch = CRUDcontext.extend('libex.CRUDfetch', {

    metadata: {
      publicMethods: []
    },

    constructor: function (sName, sURL, aPatternList) {
      CRUDcontext.apply(this, arguments);
      this.url = sURL;
      this.addCRUD('default', this._createFetch, this._readFetch, this._updateFetch, this._deleteFetch);
      this.setCurrent('default');
      this.setPatternList(aPatternList);
    },

    setPatternList: function (aPatternList) {
      if (!this._checkPatternList(aPatternList)) {
        return;
      }
      this.clearContextOperations();
      aPatternList.forEach(oPattern => {
        this.addContextOperations({
          type: oPattern.type,
          pattern: oPattern.pattern,
          operations: [
            {
              type: 'field',
              field: 'serviceURL',
              operation: oPattern.uri
            },
            {
              type: 'field',
              field: 'body',
              operation: oPattern.body
            },
            {
              type: 'field',
              field: 'req',
              operation: oPattern.req
            },
            {
              type: 'custom',
              field: 'oData',
              operation: this._fetch.bind(this)
            },
            {
              type: 'field',
              operation: oPattern.task
            }
          ]
        })
      });
    },

    _newContext: function (...args) {
      this.newContext({
        url: this.url,
        uri: args[0],
        type: args.length >= 3? args[2]: args[1],
        params: args.length >= 3? args[1]: {},
        model: this.model
      });
    },

    _fetch: async function (oContext) {
      if (oContext.req && oContext.body) {
        oContext.req.body = oContext.body; 
      }
      let oRes = await fetch(oContext.serviceURL, oContext.req);
      let sText = await oRes.text();
      return this._getJSON(sText);
    },

    _findCustomPattern: function () {
      let uri  = this.getContext().uri;
      let type = this.getContext().type;
      let list = this.getContextOperationsList();
      let isFounded = false;
      for (let i = 0; i < list.length; i++) {
        let oPattern = list[i];
        if (type === oPattern.type) {
          let aPatternMatched = uri.match(oPattern.pattern);
          if (aPatternMatched) {
            this.addToContext('patternMatched', aPatternMatched);
            this.setContextOperations(oPattern);
            isFounded = true;
            break;
          }
        }
      }
      if (!isFounded) {
        console.error(`pattern for uri "${uri}" & type "${type}" not founded.`);
        return;
      }
      return this._nextPromiseChain();
    },

    _createFetch: function (...args) {
      this._newContext(...args, 'create');
      return this._findCustomPattern().then(() => {
        return this.runContextOperations();
      });
    },

    _readFetch: function (...args) {
      this._newContext(...args, 'read');
      return this._findCustomPattern().then(() => {
        return this.runContextOperations();
      });
    },

    _updateFetch: function (...args) {
      this._newContext(...args, 'update');
      return this._findCustomPattern().then(() => {
        return this.runContextOperations();
      });
    },

    _deleteFetch: function (...args) {
      this._newContext(...args, 'delete');
      return this._findCustomPattern().then(() => {
        return this.runContextOperations();
      });
    },

    _getJSON: function (sText) {
      let data;
      try {
        data = JSON.parse(sText);
      } catch (error) {
        return undefined;
      }
      return data;
    },

    /* Check's */

    _checkPatternList: function (aPatternList) {
      if (!aPatternList && !Array.isArray(aPatternList)) {
        console.warn('aPatternList not found <array>');
        return false;
      }
      if (!aPatternList.every(oItem => { 
        return oItem.type && typeof(oItem.type)    === 'string'   &&
          oItem.pattern   && typeof(oItem.pattern) === 'object'   &&
          oItem.uri       && typeof(oItem.uri)     === 'function' &&
          oItem.body      && typeof(oItem.body)    === 'function' &&
          oItem.req       && typeof(oItem.req)     === 'function' &&
          oItem.task      && typeof(oItem.task)    === 'function'
        }
      )) {
        console.warn('oPattern not found. Structure: Object{ type <string>, pattern <regexp>, uri <function>, ' +
          'body <function>, req <function>, task <function> }');
        return false;
      }
      return true;
    },

  });

  return CRUDfetch;

});
