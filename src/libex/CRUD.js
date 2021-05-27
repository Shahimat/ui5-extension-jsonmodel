/**
 * Базовый класс, определяющий:
 * 1. Функции CRUD, которые будут использоваться в любой программе и на которые можно навесить ссылки без
 * опасения того, что они поменяют свой контекст.
 * 2. Вторичное множество функций CRUD [CRUD1, CRUD2, ...]. Данные функции используются или не используются 
 * в зависимости от пользовательских установок. Иными словами первые функции CRUD явно вызывают один элемент 
 * из множества CRUD -> CRUD1, CRUD -> CRUD2, ...
 */
sap.ui.define([
  'sap/ui/base/Object'
], (
  Object
) => {
  'use strict';

  const CRUD = Object.extend('libex.CRUD', {

    metadata: {
      publicMethods: ['setContext', 'addCRUD', 'addComplexCRUD', 'setCurrent', 'setPointers',
      'getChilds', 'getCurrent']
    },

    isComplexCRUD: true,

    constructor: function (sName, oModel = undefined) {
      Object.call(this);
      this.content = [];
      this.current = undefined;
      this.name = sName;
      this.setModel(oModel);
    },

    setModel: function (oModel) {
      this.model = oModel;
    },

    addComplexCRUD: function (oCRUD) {
      if (!oCRUD || !oCRUD.isComplexCRUD) {
        console.warn('oCRUD is not complex');
        return;
      }
      oCRUD.setModel(this.model);
      this.content.push(oCRUD);
    },

    addCRUD: function (sName, fCreate, fRead, fUpdate, fDelete) {
      if (!sName || !fCreate || !fRead || !fUpdate || !fDelete) {
        console.warn('not all data entered');
        return;
      }
      this.content.push({
        isComplexCRUD: false,
        name:   sName,
        _create: fCreate,
        _read:   fRead,
        _update: fUpdate,
        _delete: fDelete,
      })
    },

    setCurrent: function (sName, bAll = false) {
      this.current = this.content.find(oItem => oItem.name === sName);
      if (bAll) {
        this.content.forEach(oCRUD => {
          if (oCRUD.isComplexCRUD) {
            oCRUD.setCurrent(sName, true);
          }
        });
      }
    },

    setPointers: function (oControl, aFieldNames = undefined) {
      if (!aFieldNames) {
        aFieldNames = ['create', 'read', 'update', 'delete'];
      }
      if (!oControl || !Array.isArray(aFieldNames) || !aFieldNames.length === 4) {
        console.warn(`oControl or aFieldNames (array 4 items) not found`);
        return;
      }
      oControl[aFieldNames[0]] = this._create.bind(this);
      oControl[aFieldNames[1]] = this._read.bind(this);
      oControl[aFieldNames[2]] = this._update.bind(this);
      oControl[aFieldNames[3]] = this._delete.bind(this);
    },

    setContext: function (oContext, bAll = false) {
      if (!oContext) {
        console.warn('context not defined');
      }
      this.content = this.content.map(oItem => {
        if (oItem.isComplexCRUD) {
          if (bAll) {
            oItem.setContext(oContext, true);
          }
          return oItem;
        } else {
          return {
            name:   oItem.name,
            _create: oItem._create.bind(oContext),
            _read:   oItem._read.bind(oContext),
            _update: oItem._update.bind(oContext),
            _delete: oItem._delete.bind(oContext),
          }
        }
      })
    },

    getChilds: function () {
      return this.content
    },

    getCurrent: function () {
      return this.current;
    },

    _create: function (...args) {
      return this.current._create(...args);
    },

    _read: function (...args) {
      return this.current._read(...args);
    },

    _update: function (...args) {
      return this.current._update(...args);
    },

    _delete: function (...args) {
      return this.current._delete(...args);
    }

  });

  return CRUD;

});
