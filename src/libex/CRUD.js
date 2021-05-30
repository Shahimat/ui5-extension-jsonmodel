/**
 * Базовый класс, определяющий:
 * 1. Функции CRUD, которые будут использоваться в любой программе и на которые можно навесить ссылки без
 * опасения того, что они поменяют свой контекст (см. CallSwitch.js).
 * 2. Вторичное множество функций CRUD [CRUD1, CRUD2, ...]. Данные функции используются или не используются 
 * в зависимости от пользовательских установок. Иными словами первые функции CRUD явно вызывают один элемент 
 * из множества CRUD -> CRUD1, CRUD -> CRUD2, ...
 */
sap.ui.define([
  'sap/ui/base/Object',
  'libex/CallSwitch'
], (
  Object,
  CallSwitch
) => {
  'use strict';

  const CRUD = Object.extend('libex.CRUD', {

    metadata: {
      publicMethods: [
        'setDefaultContext', 'addCRUD', 'addComplexCRUD', 'setCurrent', 'setPointers', 'getChilds',
        'getCurrent', 'setModel'
      ]
    },

    isComplexCRUD: true,

    constructor: function (sName) {
      Object.call(this);
      this.content = [];
      this.current = undefined;
      this.name = sName;
      this._create = new CallSwitch(/* default context */ this);
      this._read   = new CallSwitch(/* default context */ this);
      this._update = new CallSwitch(/* default context */ this);
      this._delete = new CallSwitch(/* default context */ this);
    },

    setModel: function (oModel) {
      this.model = oModel;
    },

    addComplexCRUD: function (anyCRUD) {
      if (!this._checkAnyComplexCRUD(anyCRUD)) {
        return;
      }
      const addObjectCRUD = (oCRUD) => {
        oCRUD.setModel(this.model);
        this.content.push(oCRUD);
      }
      if (Array.isArray(anyCRUD)) {
        anyCRUD.forEach(oCRUD => {
          addObjectCRUD(oCRUD);
        });
      } else {
        addObjectCRUD(anyCRUD);
      }
    },

    addCRUD: function (sName, fCreate, fRead, fUpdate, fDelete) {
      if (!sName || !fCreate || !fRead || !fUpdate || !fDelete) {
        console.warn('not all data entered');
        return;
      }
      this.content.push({
        isComplexCRUD: false,
        name:    sName,
        _create: fCreate,
        _read:   fRead,
        _update: fUpdate,
        _delete: fDelete,
      })
    },

    setCurrent: function (sName) {
      this.current = this.getCRUD(sName);
      if (this.current) {
        if (this.current.isComplexCRUD) {
          this._create.setCurrent( this.current._create.getFunction() );
          this._read.setCurrent(   this.current._read.getFunction()   );
          this._update.setCurrent( this.current._update.getFunction() );
          this._delete.setCurrent( this.current._delete.getFunction() );
        } else {
          this._create.setCurrent( this.current._create );
          this._read.setCurrent(   this.current._read   );
          this._update.setCurrent( this.current._update );
          this._delete.setCurrent( this.current._delete );
        }
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
      this._create.setPointer(oControl, aFieldNames[0]);
      this._read.setPointer(  oControl, aFieldNames[1]);
      this._update.setPointer(oControl, aFieldNames[2]);
      this._delete.setPointer(oControl, aFieldNames[3]);
    },

    setDefaultContext: function (oContext) {
      if (!oContext) {
        console.warn('context not defined');
        return;
      }
      this._create.setDefaultContext(oContext);
      this._read.setDefaultContext(  oContext);
      this._update.setDefaultContext(oContext);
      this._delete.setDefaultContext(oContext);
    },

    getCRUD: function (sName) {
      return this.content.find(oItem => oItem.name === sName);
    },

    getChilds: function () {
      return this.content;
    },

    getCurrent: function () {
      return this.current;
    },

    /* Check's */

    _checkAnyComplexCRUD: function (anyComplexCrud) {
      const checkObjectComplexCrud = (oCRUD) => {
        if (!oCRUD || !oCRUD.isComplexCRUD) {
          console.warn('oCRUD is not complex');
          return false;
        }
        return true;
      };
      if (!anyComplexCrud) {
        console.warn('anyComplexCrud not found');
        return false;
      }
      if (Array.isArray(anyComplexCrud)) {
        if (anyComplexCrud.every(oItem => checkObjectComplexCrud(oItem))) {
          return true;
        }
        console.warn('please check array of CRUD');
        return false;
      } else if (typeof(anyComplexCrud) === 'object') {
        return checkObjectComplexCrud(anyComplexCrud);
      }
      console.warn('anyComplexCrud must be an array or object');
      return false;
    }

  });

  return CRUD;

});
