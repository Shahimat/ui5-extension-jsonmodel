sap.ui.define([
    
], function () {

  sap.ui.getCore().initLibrary({
    name: 'libex',
    version: '0.0.1',
    dependencies: [
      'sap.ui.core'
    ],
    types: [],
    interfaces: [],
    controls: [
      'libex.JSONModel'
    ],
    elements: []
  });

  return libex;

}, /* bExport */ false);