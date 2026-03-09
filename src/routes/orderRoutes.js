const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 */
router.post("/order", authMiddleware, createOrder);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 */
router.get("/order/list", authMiddleware, listOrders);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Busca um pedido pelo número
 *     tags: [Orders]
 */
router.get("/order/:orderId", authMiddleware, getOrderById);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     tags: [Orders]
 */
router.put("/order/:orderId", authMiddleware, updateOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Orders]
 */
router.delete("/order/:orderId", authMiddleware, deleteOrder);

module.exports = router;