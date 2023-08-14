const express = require("express");
const router = express.Router();
const Contenedor = require("../Contenedor.js");
const path = require("path");

const productsFile = new Contenedor(
  path.join(__dirname, "..", "db/productos.json")
);

let products;

productsFile.getAll().then((result) => (products = result));

app.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts", products);
});

module.exports = router;
