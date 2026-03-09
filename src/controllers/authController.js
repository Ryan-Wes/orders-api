const jwt = require("jsonwebtoken");

function login(req, res) {
  const { username, password } = req.body;

  // validação simples só para demonstrar autenticação
  if (username !== "admin" || password !== "123456") {
    return res.status(401).json({
      error: "Usuário ou senha inválidos."
    });
  }

  const token = jwt.sign(
    { username: "admin" },
    "minha_chave_secreta",
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: "Login realizado com sucesso.",
    token
  });
}

module.exports = {
  login
};