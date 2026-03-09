const express = require("express");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

// rota inicial para verificar se a API está no ar
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de pedidos funcionando",
  });
});

// rotas da API
app.use("/", orderRoutes);

module.exports = app;