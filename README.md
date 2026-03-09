# Orders API

API desenvolvida em **Node.js**, **Express** e **PostgreSQL** para
gerenciamento de pedidos e seus itens.

Este projeto foi criado como resposta a um desafio técnico, com foco em
boas práticas de organização de código, tratamento de erros e separação
de responsabilidades.

------------------------------------------------------------------------

## Tecnologias utilizadas

-   Node.js
-   Express
-   PostgreSQL
-   pg (driver PostgreSQL para Node)
-   Thunder Client / Postman para testes

------------------------------------------------------------------------

## Estrutura do projeto

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
    └── README.md

### Responsabilidade de cada camada

**server.js**\
Responsável por iniciar o servidor da aplicação.

**app.js**\
Configuração principal do Express e registro das rotas.

**config/db.js**\
Gerencia a conexão com o banco PostgreSQL.

**routes**\
Define as rotas da API.

**controllers**\
Contém a lógica de negócio e comunicação com o banco.

------------------------------------------------------------------------

# Banco de dados

O projeto utiliza PostgreSQL com duas tabelas:

## Tabela `orders`

  campo           tipo
  --------------- -----------
  order_id        varchar
  value           numeric
  creation_date   timestamp

## Tabela `items`

  campo        tipo
  ------------ ---------
  id           serial
  order_id     varchar
  product_id   integer
  quantity     integer
  price        numeric

### Script de criação das tabelas

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

### 1. Clonar o repositório

    git clone <url-do-repositorio>

### 2. Instalar dependências

    npm install

### 3. Configurar conexão com PostgreSQL

Editar o arquivo:

    src/config/db.js

Exemplo:

``` javascript
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "orders_api",
  password: "SUA_SENHA",
  port: 5432,
});
```

------------------------------------------------------------------------

### 4. Executar a API

    npm start

Servidor rodará em:

    http://localhost:3000

------------------------------------------------------------------------

# Endpoints da API

## Criar pedido

    POST /order

### Exemplo de payload

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

## Buscar pedido por ID

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

# Tratamento de erros

A API retorna códigos HTTP apropriados:

  código   significado
  -------- --------------------------
  200      sucesso
  201      recurso criado
  400      erro de validação
  404      recurso não encontrado
  500      erro interno do servidor

------------------------------------------------------------------------

# Observações

A API recebe os dados no formato especificado no desafio e realiza o
**mapeamento interno dos campos** para o modelo relacional utilizado no
banco de dados.

Isso garante desacoplamento entre o formato da requisição e a estrutura
persistida.

------------------------------------------------------------------------

# Autor

Wesley Ryan Lopes
