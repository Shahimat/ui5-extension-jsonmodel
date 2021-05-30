/**
 * Базовый класс ссылочных переключателей. Определяет операцию по имени, которая не будет мутировать 
 * название и контекст и при этом будет способна переключать направление вызова.
 */
 sap.ui.define([
  'sap/ui/base/Object'
], (
  Object
) => {
  'use strict';

  const CallSwitch = Object.extend('libex.CRUD', {

    metadata: {
      publicMethods: ['setContext', 'addCRUD', 'addComplexCRUD', 'setCurrent', 'setPointers',
      'getChilds', 'getCurrent']
    },

    constructor: function (oDefaultContext = undefined) {
      Object.call(this);
      this.current = undefined;
      this.setDefaultContext(oDefaultContext);
    },

    setDefaultContext: function (oDefaultContext) {
      this.defaultContext = oDefaultContext;
    },

    callPointer: function (...args) {
      return this.current(...args);
    },

    getFunction: function () {
      return this.callPointer.bind(this);
    },

    setCurrent: function (fCurrent, oContext = undefined) {
      if (!fCurrent) {
        this.current = undefined;
        return;
      }
      if (!oContext && this.defaultContext) {
        oContext = this.defaultContext;
      }
      if (oContext) {
        this.current = fCurrent.bind(oContext);
      } else {
        this.current = fCurrent;
      }
    },

    setPointer: function (oControl, sFieldName) {
      if (!oControl || !sFieldName) {
        console.warn(`oControl or sFieldName not found`);
        return;
      }
      oControl[sFieldName] = this.callPointer.bind(this);
    },

  });

  return CallSwitch;

});
