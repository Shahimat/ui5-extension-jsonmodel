const express = require('express');
const app = express();
const jsonParser = express.json();
const port = 8090;

let Products = require('./sample1.json');

// Read all
app.get('/', (req, res) => {
  res.send(Products);
});

// Read id
app.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  res.send(Products[id]? Products[id]: {});
});

// Create
app.post('/', jsonParser, (req, res) => {
  if(!req.body || !req.body.ProductName || !req.body.UnitPrice) {
    return res.sendStatus(400);
  }
  let oData = {
    ProductID: Products[Products.length - 1].ProductID + 1,
    ProductName: req.body.ProductName,
    UnitPrice: req.body.UnitPrice
  }
  Products.push(oData);
  res.send(oData);
});

// Update
app.put('/', jsonParser, (req, res) => {
  if(!req.body || !req.body.ProductID || !req.body.ProductName || !req.body.UnitPrice) {
    return res.sendStatus(400);
  }
  let nIndex = Products.findIndex(oItem => oItem.ProductID === req.body.ProductID);
  if (nIndex === undefined || nIndex < 0 || nIndex >= Products.length) {
    return res.sendStatus(400);
  }
  Products[nIndex].ProductName = req.body.ProductName;
  Products[nIndex].UnitPrice   = req.body.UnitPrice;
  res.send(Products[nIndex]);
});

// Delete id
app.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (id === undefined || id < 0 || id >= Products.length) {
    return res.sendStatus(400);
  }
  Products = Products.filter(oItem => oItem.ProductID !== id);
  res.send('OK');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});