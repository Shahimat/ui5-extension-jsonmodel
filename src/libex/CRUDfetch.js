sap.ui.define([
    'libex/CRUD'
], (
    CRUD
) => {
  'use strict';

  const CRUDfetch = CRUD.extend('libex.CRUDfetch', {

    metadata: {
      publicMethods: []
    },

    constructor: function (sName, sURL, aPatterns) {
      CRUD.apply(this, arguments);
      this.url = sURL;
      this.addCRUD('production', this._createFetch, this._readFetch, this._updateFetch, this._deleteFetch);
      this.addCRUD('develop', this._createFetch, this._readFetch, this._updateFetch, this._deleteFetch);
      this.setContext(this);
      this.patterns = aPatterns;
    },

    _newContext: function (...args) {
      delete this.context;
      this.context = {
        data: {
          url: this.url,
          uri: args[0],
          type: args.length >= 3? args[2]: args[1],
          params: args.length >= 3? args[1]: {},
          model: this.model
        },
        pattern: undefined
      };
    },

    _modifyContext: async function () {
      delete this.context.data.serviceURL;
      delete this.context.data.body;
      delete this.context.data.req;
      delete this.context.data.serviceURI;
      if (this.context.pattern.uri) {
        let uri = this.context.pattern.uri(this.context.data);
        if (uri) {
          this.context.data.serviceURL = uri;
        }
      }
      if (this.context.pattern.body) {
        let body = this.context.pattern.body(this.context.data);
        if (body) {
          this.context.data.body = body;
        }
      }
      if (this.context.pattern.req) {
        let req = this.context.pattern.req(this.context.data);
        if (req) {
          this.context.data.req = req;
          this.context.data.req.body = this.context.data.body;
        }
      }
      let oRes = await fetch(this.context.data.serviceURL, this.context.data.req);
      let sText = await oRes.text();
      this.context.data.oData = this._getJSON(sText);
      if (this.context.pattern.task) {
        this.context.pattern.task(this.context.data);
      }
      return this._nextPromiseChain(this.context.data.oData);
    },

    _findCustomPattern: function () {
      let uri  = this.context.data.uri;
      let type = this.context.data.type;
      delete this.context.data.patternMatched;
      delete this.context.pattern;
      for (let i = 0; i < this.patterns.length; i++) {
        let oPattern = this.patterns[i];
        if (type === oPattern.type) {
          let aPatternMatched = uri.match(oPattern.pattern);
          if (aPatternMatched) {
            this.context.data.patternMatched = aPatternMatched;
            this.context.pattern = oPattern;
            break;
          }
        }
      }
      return this._nextPromiseChain();
    },

    _createFetch: function (...args) {
      this._newContext(...args, 'create');
      return this._findCustomPattern().then(() => {
        return this._modifyContext();
      });
    },

    _readFetch: function (...args) {
      this._newContext(...args, 'read');
      return this._findCustomPattern().then(() => {
        return this._modifyContext();
      });
    },

    _updateFetch: function (...args) {
      this._newContext(...args, 'update');
      return this._findCustomPattern().then(() => {
        return this._modifyContext();
      });
    },

    _deleteFetch: function (...args) {
      this._newContext(...args, 'delete');
      return this._findCustomPattern().then(() => {
        return this._modifyContext();
      });
    },

    _nextPromiseChain: function (...args) {
      return new Promise((res, rej) => {
        res(...args);
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
    }

  });

  return CRUDfetch;

});
