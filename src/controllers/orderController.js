const pool = require("../config/db");

// converte o payload recebido no formato usado internamente pela aplicação
function mapOrderData(orderData) {
  return {
    orderId: orderData.numeroPedido,
    value: Number(orderData.valorTotal),
    creationDate: new Date(orderData.dataCriacao),
    items: orderData.items.map((item) => ({
      productId: Number(item.idItem),
      quantity: Number(item.quantidadeItem),
      price: Number(item.valorItem),
    })),
  };
}

// faz uma validação simples dos dados recebidos antes de tentar salvar no banco
function validateOrderBody(body) {
  if (!body.numeroPedido || !body.dataCriacao || body.valorTotal == null || !body.items) {
    return "Os campos numeroPedido, valorTotal, dataCriacao e items são obrigatórios.";
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return "O campo items deve ser um array com pelo menos um item.";
  }

  if (Number.isNaN(Number(body.valorTotal))) {
    return "O campo valorTotal deve ser numérico.";
  }

  if (Number.isNaN(new Date(body.dataCriacao).getTime())) {
    return "O campo dataCriacao deve conter uma data válida.";
  }

  for (const item of body.items) {
    if (!item.idItem || item.quantidadeItem == null || item.valorItem == null) {
      return "Cada item deve conter idItem, quantidadeItem e valorItem.";
    }

    if (Number.isNaN(Number(item.idItem))) {
      return "O campo idItem de cada item deve ser numérico.";
    }

    if (Number.isNaN(Number(item.quantidadeItem))) {
      return "O campo quantidadeItem de cada item deve ser numérico.";
    }

    if (Number.isNaN(Number(item.valorItem))) {
      return "O campo valorItem de cada item deve ser numérico.";
    }
  }

  return null;
}

// cria um novo pedido
async function createOrder(req, res) {
  const client = await pool.connect();

  try {
    const validationError = validateOrderBody(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const mappedOrder = mapOrderData(req.body);

    await client.query("BEGIN");

    const insertOrderQuery = `
      INSERT INTO orders (order_id, value, creation_date)
      VALUES ($1, $2, $3)
      RETURNING order_id, value, creation_date
    `;

    const orderResult = await client.query(insertOrderQuery, [
      mappedOrder.orderId,
      mappedOrder.value,
      mappedOrder.creationDate,
    ]);

    const insertItemQuery = `
      INSERT INTO items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of mappedOrder.items) {
      await client.query(insertItemQuery, [
        mappedOrder.orderId,
        item.productId,
        item.quantity,
        item.price,
      ]);
    }

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Pedido criado com sucesso.",
      order: {
        orderId: orderResult.rows[0].order_id,
        value: Number(orderResult.rows[0].value),
        creationDate: orderResult.rows[0].creation_date,
        items: mappedOrder.items,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Já existe um pedido com esse número.",
      });
    }

    return res.status(500).json({
      error: "Erro interno ao criar o pedido.",
      details: error.message,
    });
  } finally {
    client.release();
  }
}

// busca um pedido pelo número
async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;

    const orderResult = await pool.query(
      `
      SELECT order_id, value, creation_date
      FROM orders
      WHERE order_id = $1
      `,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: "Pedido não encontrado.",
      });
    }

    const itemResult = await pool.query(
      `
      SELECT product_id, quantity, price
      FROM items
      WHERE order_id = $1
      ORDER BY id ASC
      `,
      [orderId]
    );

    return res.status(200).json({
      orderId: orderResult.rows[0].order_id,
      value: Number(orderResult.rows[0].value),
      creationDate: orderResult.rows[0].creation_date,
      items: itemResult.rows.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno ao buscar o pedido.",
      details: error.message,
    });
  }
}

// lista todos os pedidos cadastrados
async function listOrders(req, res) {
  try {
    const result = await pool.query(`
      SELECT order_id, value, creation_date
      FROM orders
      ORDER BY creation_date DESC
    `);

    const orders = result.rows.map((order) => ({
      orderId: order.order_id,
      value: Number(order.value),
      creationDate: order.creation_date,
    }));

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno ao listar os pedidos.",
      details: error.message,
    });
  }
}

// atualiza um pedido existente
async function updateOrder(req, res) {
  const client = await pool.connect();

  try {
    const { orderId } = req.params;
    const validationError = validateOrderBody(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const existingOrder = await client.query(
      `
      SELECT order_id
      FROM orders
      WHERE order_id = $1
      `,
      [orderId]
    );

    if (existingOrder.rows.length === 0) {
      return res.status(404).json({
        error: "Pedido não encontrado.",
      });
    }

    const mappedOrder = mapOrderData(req.body);

    await client.query("BEGIN");

    await client.query(
      `
      UPDATE orders
      SET order_id = $1, value = $2, creation_date = $3
      WHERE order_id = $4
      `,
      [mappedOrder.orderId, mappedOrder.value, mappedOrder.creationDate, orderId]
    );

    // remove os itens antigos e recria com base no body recebido
    await client.query("DELETE FROM items WHERE order_id = $1", [orderId]);

    const insertItemQuery = `
      INSERT INTO items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of mappedOrder.items) {
      await client.query(insertItemQuery, [
        mappedOrder.orderId,
        item.productId,
        item.quantity,
        item.price,
      ]);
    }

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Pedido atualizado com sucesso.",
      order: {
        orderId: mappedOrder.orderId,
        value: mappedOrder.value,
        creationDate: mappedOrder.creationDate,
        items: mappedOrder.items,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Já existe um pedido com esse número.",
      });
    }

    return res.status(500).json({
      error: "Erro interno ao atualizar o pedido.",
      details: error.message,
    });
  } finally {
    client.release();
  }
}

// remove um pedido pelo número
async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM orders
      WHERE order_id = $1
      RETURNING order_id
      `,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Pedido não encontrado.",
      });
    }

    return res.status(200).json({
      message: "Pedido removido com sucesso.",
      orderId: result.rows[0].order_id,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno ao remover o pedido.",
      details: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
};