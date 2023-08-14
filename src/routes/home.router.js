const express = require("express");
const router = express.Router();
const Contenedor = require("../Contenedor.js");
const path = require("path");

const productsFile = new Contenedor(
  path.join(__dirname, "..", "db/productos.json")
);

let products;

productsFile.getAll().then((result) => (products = result));

router.get("/", (req, res) => {
  res.render("home", { products });
});

module.exports = router;
