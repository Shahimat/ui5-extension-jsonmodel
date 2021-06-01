sap.ui.define([
  'libex/core/CRUDuniversal',
  'libex/patterns/FetchPattern'
], (
  CRUDuniversal,
  FetchPattern
) => {
  'use strict';

  return [

    new CRUDuniversal('sample1', {
      uri: 'http://localhost:8090',
      tasks: [
        'fullUri',
        'body',
        'req',
        'fetch',
        'task'
      ],
      common: {
        fetch: FetchPattern.fetch
      }
    },
    [
      {
        type: 'create',
        pattern: /^\/$/,
        fullUri:  (oContext) => `${oContext.serviceURI}/`,
        body: (oContext) => JSON.stringify(oContext.params),
        req:  (oContext) => {
          return {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
          }
        },
      },
      {
        type: 'read',
        pattern: /^\/$/,
        fullUri:  (oContext) => `${oContext.serviceURI}/`,
        task: (oContext) => {
          oContext.model.setProperty(oContext.uri, oContext.oData);
        }
      },
      {
        type: 'read',
        pattern: /^\/(\d+)$/,
        fullUri:  (oContext) => `${oContext.serviceURI}/${oContext.patternMatched[1]}`,
      },
      {
        type: 'update',
        pattern: /^\/$/,
        fullUri:  (oContext) => `${oContext.serviceURI}/`,
        body: (oContext) => JSON.stringify(oContext.params),
        req:  (oContext) => {
          return {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
          }
        },
      },
      {
        type: 'delete',
        pattern: /^\/(\d+)$/,
        fullUri:  (oContext) => `${oContext.serviceURI}/${oContext.patternMatched[1]}`,
        req:  (oContext) => {
          return {
            method: 'DELETE',
          }
        },
      },
    ]),

  ];

});
