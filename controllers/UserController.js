const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
var bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");
// var secret = process.env.JWT_SECRET; // Chave secreta JWT definida como variável de ambiente
var secret = "adsuasgdhjasgdhjdgahjsg12hj3eg12hj3g12hj3g12hj3g123"; // Chave secreta JWT definida diretamente no código

const multer = require("multer");

class UserController {
  // Configurar o multer para salvar os arquivos na pasta "uploads"
  constructor() {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });

    this.upload = multer({ storage: storage });
  }

  async edit(req, res) {
    var { id, name, role, email, ubs } = req.body;

    // Verifique se a imagem de perfil foi enviada pelo cliente
    var profilePicture = undefined;
    if (req.file) {
      profilePicture = req.file.filename;
    }

    var result = await User.update(id, email, name, role, ubs, profilePicture);
    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("Tudo OK!");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Ocorreu um erro no servidor!");
    }
  }

  //////nao modificado apartir daqui ///
  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
  }

  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);
    if (user == undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(user);
    }
  }

  async create(req, res) {
    var { email, name, password } = req.body;

    if (email == undefined || email == "" || email == " ") {
      res.status(400);
      res.json({ err: "O e-mail é inválido!" });
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "O e-mail já está cadastrado!" });
      return;
    }

    await User.new(email, password, name);

    res.status(200);
    res.send("Tudo OK!");
  }

  async remove(req, res) {
    var id = req.params.id;

    var result = await User.delete(id);

    if (result.status) {
      res.status(200);
      res.send("Tudo OK!");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async recoverPassword(req, res) {
    var email = req.body.email;
    var result = await PasswordToken.create(email);
    if (result.status) {
      res.status(200);
      res.send("" + result.token);
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async changePassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;
    var isTokenValid = await PasswordToken.validate(token);
    if (isTokenValid.status) {
      await User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      res.status(200);
      res.send("Senha alterada");
    } else {
      res.status(406);
      res.send("Token inválido!");
    }
  }

  async login(req, res) {
    var { email, password } = req.body;

    var user = await User.findByEmail(email);

    if (user != undefined) {
      var resultado = await bcrypt.compare(password, user.password);

      if (resultado) {
        var token = jwt.sign({ email: user.email, role: user.role }, secret);

        res.status(200);
        res.json({ token: token });
      } else {
        res.status(406);
        res.json({ err: "Senha incorreta" });
      }
    } else {
      res.status(406);
      res.json({ status: false, err: "O usuário não existe" });
    }
  }
}

module.exports = new UserController();
