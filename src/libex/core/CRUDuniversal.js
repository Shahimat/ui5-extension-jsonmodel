/**
 * Класс универсальных вызовов тасков в условиях контекста
 */
sap.ui.define([
  'libex/core/CRUDcontext'
], (
  CRUDcontext
) => {
  'use strict';

  const CRUDuniversal = CRUDcontext.extend('libex.patterns.CRUDuniversal', {

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
      this.addCRUD('default', this._uCreate, this._uRead, this._uUpdate, this._uDelete);
      this.setCurrent('default');
      this.setPatternList(oOptions, aPatternList);
    },

    setPatternList: function (oOptions, aPatternList) {
      if (!this._checkPatternList(oOptions, aPatternList)) {
        return;
      }
      const aSequence = oOptions.tasks;
      this.clearContextOperations();
      aPatternList.forEach(oPattern => {
        let aTasks = [];
        aSequence.forEach(sTask => {
          if (oPattern[sTask] && typeof(oPattern[sTask]) === 'function') {
            aTasks.push(oPattern[sTask]);
          } else if (oOptions.common && oOptions.common[sTask]) {
            aTasks.push(oOptions.common[sTask]);
          }
        });
        this.addContextOperations({
          type: oPattern.type,
          pattern: oPattern.pattern,
          operations: aTasks
        })
      });
    },

    _newContext: function (...args) {
      this.getContext().newContext({
        serviceURI: this.uri,
        uri: args[0],
        type: args.length >= 3? args[2]: args[1],
        params: args.length >= 3? args[1]: {},
        model: this.model
      });
    },

    _findPattern: function () {
      let oContext = this.getContext();
      let uri  = oContext.uri;
      let type = oContext.type;
      let list = this.getContextOperationsList();
      for (let i = 0; i < list.length; i++) {
        let oPattern = list[i];
        if (type === oPattern.type) {
          let aPatternMatched = uri.match(oPattern.pattern);
          if (aPatternMatched) {
            oContext.addFieldContext('patternMatched', aPatternMatched);
            this.setContextOperations(oPattern);
            return true;
          }
        }
      }
      console.error(`pattern for uri "${uri}" & type "${type}" not founded.`);
      return false;
    },

    _uCreate: function (...args) {
      return this._uOperation(...args, 'create');
    },

    _uRead: function (...args) {
      return this._uOperation(...args, 'read');
    },

    _uUpdate: function (...args) {
      return this._uOperation(...args, 'update');
    },

    _uDelete: function (...args) {
      return this._uOperation(...args, 'delete');
    },

    _uOperation: function (...args) {
      this._newContext(...args);
      if (this._findPattern()) {
        return this.runContextOperations();
      }
    },

    /* Check's */

    _checkPatternList: function (oOptions, aPatternList) {
      if (!oOptions || !oOptions.tasks || !Array.isArray(oOptions.tasks) ||
      !oOptions.tasks.every(sItem => typeof(sItem) === 'string')) {
        console.warn('oOptions.tasks not found <array of string>');
        return false;
      }
      if (!aPatternList && !Array.isArray(aPatternList)) {
        console.warn('aPatternList not found <array>');
        return false;
      }
      const aTypes = ['create','read','update','delete'];
      if (!aPatternList.every(oItem => { 
        return oItem.type && typeof(oItem.type) === 'string' && aTypes.includes(oItem.type) &&
          oItem.pattern && oItem.pattern.constructor && oItem.pattern.constructor.name === 'RegExp'
        }
      )) {
        console.warn('oPattern not found. Structure: Object{ type <string>, pattern <regexp>, task <function> }');
        console.warn(`types: ${aTypes.join(',')}`);
        return false;
      }
      return true;
    },

  });

  return CRUDuniversal;

});
