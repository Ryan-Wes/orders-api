const express = require("express");
const swaggerUi = require("swagger-ui-express");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(express.json());

// rota inicial
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de pedidos funcionando",
  });
});

// documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// rota de autenticação
app.use("/", authRoutes);

// rotas da API
app.use("/", orderRoutes);

module.exports = app;