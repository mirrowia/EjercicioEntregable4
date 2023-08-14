const express = require("express");
const path = require("path");
const app = express();
const handlebars = require("express-handlebars");
const homeRouter = require("./routes/home.router");
const realTimeProductsRouter = require("./routes/realTimeProducts.router");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const Contenedor = require("./Contenedor.js");

const productsFile = new Contenedor(path.join(__dirname, "db/productos.json"));
let products;
productsFile.getAll().then((result) => (products = result));

const PORT = 8080;

//Inicio handlebars
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//Rutas
app.use("/", homeRouter);
app.use("/", realTimeProductsRouter);

//Socket
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.emit("producs", products);

  //Evento agregar producto
  socket.on("add", (data) => {
    productsFile.save(data);
    console.log(`Product agregado: ${data}`);
    io.emit("add", data);
  });

  socket.on("del", (id) => {
    productsFile.deleteById(id);

    console.log(`Product con id ${id} eliminado`);
    io.emit("del", id);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
