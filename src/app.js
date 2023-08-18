const express = require("express");
const path = require("path");
const app = express();
const handlebars = require("express-handlebars");
const homeRouter = require("./routes/home.router");
const realTimeProductsRouter = require("./routes/realTimeProducts.router");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const Contenedor = require("./Contenedor.js");
const { log } = require("console");

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
  socket.on("addProduct", (data) => {
    productsFile.save(data).then(() => {
      productsFile.getAll().then((result) => {
        var product = result.filter((obj) => obj.code == data.code);
        io.sockets.emit("addProduct", product[0]);
      });
    });
  });

  socket.on("removeProduct", (data) => {
    productsFile.deleteById(data);
    console.log(`Product con id ${data} eliminado`);
    io.emit("removeProduct", data);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
