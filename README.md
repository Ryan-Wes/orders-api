# Orders API

API REST desenvolvida em **Node.js**, **Express** e **PostgreSQL** para
gerenciamento de pedidos e seus itens.

Este projeto implementa um CRUD completo de pedidos com persistência em
banco de dados relacional e organização em camadas.

------------------------------------------------------------------------

# Tecnologias utilizadas

-   Node.js
-   Express
-   PostgreSQL
-   pg (driver PostgreSQL para Node)

------------------------------------------------------------------------

# Estrutura do projeto

    orders-api
    │
    ├── src
    │   ├── config
    │   │   └── db.js
    │   │
    │   ├── controllers
    │   │   └── orderController.js
    │   │
    │   ├── routes
    │   │   └── orderRoutes.js
    │   │
    │   └── app.js
    │
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── README.md

------------------------------------------------------------------------

# Banco de dados

O projeto utiliza PostgreSQL com duas tabelas principais.

### Tabela `orders`

    order_id       varchar
    value          numeric
    creation_date  timestamp

### Tabela `items`

    id         serial
    order_id   varchar
    product_id integer
    quantity   integer
    price      numeric

------------------------------------------------------------------------

## Script SQL para criação das tabelas

``` sql
CREATE TABLE orders (
  order_id VARCHAR(50) PRIMARY KEY,
  value NUMERIC(10,2) NOT NULL,
  creation_date TIMESTAMP NOT NULL
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL
);
```

------------------------------------------------------------------------

# Como executar o projeto

## 1. Clonar o repositório

    git clone https://github.com/Ryan-Wes/orders-api.git

## 2. Entrar na pasta

    cd orders-api

## 3. Instalar dependências

    npm install

## 4. Configurar conexão com PostgreSQL

Editar:

    src/config/db.js

Exemplo:

``` javascript
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "orders_api",
  password: "SUA_SENHA",
  port: 5432
});
```

------------------------------------------------------------------------

## 5. Executar a aplicação

    npm start

Servidor disponível em:

    http://localhost:3000

------------------------------------------------------------------------

# Endpoints da API

## Criar pedido

    POST /order

Exemplo de payload:

``` json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

------------------------------------------------------------------------

## Buscar pedido

    GET /order/:orderId

------------------------------------------------------------------------

## Listar pedidos

    GET /order/list

------------------------------------------------------------------------

## Atualizar pedido

    PUT /order/:orderId

------------------------------------------------------------------------

## Remover pedido

    DELETE /order/:orderId

------------------------------------------------------------------------

# Códigos HTTP

    200  Sucesso
    201  Recurso criado
    400  Erro de validação
    404  Recurso não encontrado
    409  Conflito
    500  Erro interno

------------------------------------------------------------------------

# Autor

Wesley Ryan Lopes
