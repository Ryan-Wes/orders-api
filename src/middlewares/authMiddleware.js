const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // verifica se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({
      error: "Token não informado."
    });
  }

  const parts = authHeader.split(" ");

  // verifica formato do header
  if (parts.length !== 2) {
    return res.status(401).json({
      error: "Token mal formatado."
    });
  }

  const [scheme, token] = parts;

  // verifica se começa com Bearer
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      error: "Formato do token inválido."
    });
  }

  try {
    const decoded = jwt.verify(token, "minha_chave_secreta");

    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido ou expirado."
    });
  }
}

module.exports = authMiddleware;