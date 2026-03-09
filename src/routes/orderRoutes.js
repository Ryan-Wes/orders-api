const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

// cria um novo pedido
router.post("/order", createOrder);

// lista todos os pedidos
router.get("/order/list", listOrders);

// busca um pedido específico
router.get("/order/:orderId", getOrderById);

// atualiza um pedido existente
router.put("/order/:orderId", updateOrder);

// remove um pedido
router.delete("/order/:orderId", deleteOrder);

module.exports = router;