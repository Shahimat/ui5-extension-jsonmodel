sap.ui.define([
  'libex/patterns/CRUDfetch'
], (
  CRUDfetch
) => {
  'use strict';

  return [

    new CRUDfetch('sample1', {
      url: 'http://localhost:8090'
    },
    [
      {
        type: 'create',
        pattern: /^\/$/,
        uri:  (oContext) => `${oContext.url}/`,
        body: (oContext) => JSON.stringify(oContext.params),
        req:  (oContext) => {
          return {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
          }
        },
        task: (oContext) => {}
      },
      {
        type: 'read',
        pattern: /^\/$/,
        uri:  (oContext) => `${oContext.url}/`,
        body: (oContext) => {},
        req:  (oContext) => {},
        task: (oContext) => {
          oContext.model.setProperty(oContext.uri, oContext.oData);
        }
      },
      {
        type: 'read',
        pattern: /^\/(\d+)$/,
        uri:  (oContext) => `${oContext.url}/${oContext.patternMatched[1]}`,
        body: (oContext) => {},
        req:  (oContext) => {},
        task: (oContext) => {}
      },
      {
        type: 'update',
        pattern: /^\/$/,
        uri:  (oContext) => `${oContext.url}/`,
        body: (oContext) => JSON.stringify(oContext.params),
        req:  (oContext) => {
          return {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
          }
        },
        task: (oContext) => {}
      },
      {
        type: 'delete',
        pattern: /^\/(\d+)$/,
        uri:  (oContext) => `${oContext.url}/${oContext.patternMatched[1]}`,
        body: (oContext) => {},
        req:  (oContext) => {
          return {
            method: 'DELETE',
          }
        },
        task: (oContext) => {}
      },
    ]),

  ];

});
