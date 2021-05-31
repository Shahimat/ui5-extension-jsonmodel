/**
 * Класс, определяющий базовые методы работы с develop вызовами.
 */
sap.ui.define([
  'libex/core/CRUDcontext'
], (
  CRUDcontext
) => {
  'use strict';

  const CRUDdev = CRUDcontext.extend('libex.patterns.CRUDdev', {

    metadata: {
      publicMethods: []
    },

    constructor: function (sName, oOptions, aPatternList) {
      CRUDcontext.apply(this, arguments);
      if (!oOptions || !typeof(oOptions.uri) === 'string') {
        console.error('uri not found.');
        return;
      }
      this.uri = oOptions.uri;
      this.addCRUD('default', this._createDev, this._readDev, this._updateDev, this._deleteDev);
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
              field: 'oData',
              operation: oPattern.task
            }
          ]
        })
      });
    },

    _newContext: function (...args) {
      this.newContext({
        serviceURI: this.uri,
        uri: args[0],
        type: args.length >= 3? args[2]: args[1],
        params: args.length >= 3? args[1]: {},
        model: this.model
      });
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

    _createDev: function (...args) {
      this._newContext(...args, 'create');
      return this._findCustomPattern().then(() => {
        return this.runContextOperations();
      });
    },

    _readDev: function (...args) {
      this._newContext(...args, 'read');
      return this._findCustomPattern().then(() => {
        return this.runContextOperations();
      });
    },

    _updateDev: function (...args) {
      this._newContext(...args, 'update');
      return this._findCustomPattern().then(() => {
        return this.runContextOperations();
      });
    },

    _deleteDev: function (...args) {
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
          oItem.task      && typeof(oItem.task)    === 'function'
        }
      )) {
        console.warn('oPattern not found. Structure: Object{ type <string>, pattern <regexp>, task <function> }');
        return false;
      }
      return true;
    },

  });

  return CRUDdev;

});
