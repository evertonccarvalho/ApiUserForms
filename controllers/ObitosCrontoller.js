var obitos = require("../models/obitos");
const { default: knex } = require("knex");

class ObitosCrontoller {
  async createObitos(req, res) {
    var {
      responsavel,
      ubs,
      nome,
      nomedamae,
      idade,
      endereco,
      municipioderesidencia,
      sexo,
      prontuario,
      datadoobito,
      localdoobito,
      Causa,
    } = req.body;

    if (ubs == undefined || ubs == "" || ubs == " ") {
      res.status(400);
      res.json({ err: "Ubs Precisa ser preenchida" });
      return;
    }

    await obitos.obitos(
      responsavel,
      ubs,
      nome,
      nomedamae,
      idade,
      endereco,
      municipioderesidencia,
      sexo,
      prontuario,
      datadoobito,
      localdoobito,
      Causa
    );

    res.status(200);
    res.send("Formulario de Obitos Preenchido com Sucesso");

    // res.status(406);
    // res.send(result.err)
  }

  async indexForm(req, res) {
    var formulario = await obitos.findFormAll();
    res.json(formulario);
  }

  async findForm(req, res) {
    var id = req.params.id;
    var formulario = await obitos.findFormById(id);
    if (formulario == undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(formulario);
    }
  }
  async editForm(req, res) {
    var {
      id,
      responsavel,
      ubs,
      nome,
      nomedamae,
      idade,
      endereco,
      municipioderesidencia,
      sexo,
      prontuario,
      datadoobito,
      localdoobito,
      Causa,
    } = req.body;
    var result = await obitos.updateObitos(
      responsavel,
      id,
      ubs,
      nome,
      nomedamae,
      idade,
      endereco,
      municipioderesidencia,
      sexo,
      prontuario,
      datadoobito,
      localdoobito,
      Causa
    );
    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("Tudo OK! editado");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Ocorreu um erro no servidor!");
    }
  }
  async removeForm(req, res) {
    var id = req.params.id;

    var result = await obitos.deleteObito(id);

    if (result.status) {
      res.status(200);
      res.send("Tudo OK!");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }
}

module.exports = new ObitosCrontoller();
