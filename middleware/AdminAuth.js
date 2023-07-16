var jwt = require("jsonwebtoken");
// var secret = process.env.JWT_SECRET; // Chave secreta JWT definida como variável de ambiente
var secret = "adsuasgdhjasgdhjdgahjsg12hj3eg12hj3g12hj3g12hj3g123"; // Chave secreta JWT definida diretamente no código

module.exports = function (req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken) {
    const bearer = authToken.split(" ");
    var token = bearer[1];

    try {
      var decoded = jwt.verify(token, secret); // Verifica se o token JWT é válido

      if (decoded.role === 1) {
        next(); // Permite que a execução continue para o próximo middleware ou rota
      } else {
        res.status(403).json({ mensagem: "Você não tem permissão para isso!" });
      }
    } catch (err) {
      res.status(403).json({ mensagem: "Você não está autenticado" });
    }
  } else {
    res.status(403).json({ mensagem: "Você não está autenticado" });
  }
};
