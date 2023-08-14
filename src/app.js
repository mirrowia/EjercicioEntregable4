const express = require("express");
const path = require("path");
const app = express();
const handlebars = require("express-handlebars");
const homeRouter = require("./routes/home.router");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = 8080;

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Inicio handlebars
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//Rutas
app.use("/", homeRouter);

app.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

//Socket
io.on("connection", (socket) => {
  socket.on("message", (data) => {
    console.log(`Mensaje recibido: ${data}`);
    io.emit("message", data);
  });

  socket.on("add", (data) => {
    console.log(`Product: ${data}`);
    io.emit("product", data);
  });

  socket.on("disconnect", (socket) => {
    console.log("Cliente desconectado");
  });
});
