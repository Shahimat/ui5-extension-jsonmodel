/**
 * Устанавливает указатель контекста на себя
 */
sap.ui.define([

], (
  
) => {
  'use strict';

  return function (oFields) {
    if (!typeof(oFields) === 'object') {
      return undefined;
    }
    let oResult = {};
    for (let key in oFields) {
      if (typeof(oFields[key]) === 'function') {
        oResult[key] = oFields[key].bind(oResult);
      } else {
        oResult[key] = oFields[key];
      }
    }
    return oResult;
  }

});