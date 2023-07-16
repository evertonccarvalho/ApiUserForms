const knex = require("../database/connection");

class Obitos {
  async obitos(
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
    causa
  ) {
    try {
      await knex("obitos").insert({
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
        causa,
      });
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async findFormAll() {
    try {
      const result = await knex("obitos").select([
        "responsavel",
        "id",
        "ubs",
        "nome",
        "nomedamae",
        "idade",
        "endereco",
        "municipioderesidencia",
        "sexo",
        "prontuario",
        "datadoobito",
        "localdoobito",
        "causa",
      ]);
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async findFormById(id) {
    try {
      const result = await knex("obitos")
        .select([
          "responsavel",
          "id",
          "ubs",
          "nome",
          "nomedamae",
          "idade",
          "endereco",
          "municipioderesidencia",
          "sexo",
          "prontuario",
          "datadoobito",
          "localdoobito",
          "causa",
        ])
        .where({ id })
        .first();

      return result || undefined;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async findFormByNome(nome) {
    try {
      const result = await knex("obitos")
        .select([
          "responsavel",
          "id",
          "ubs",
          "nome",
          "nomedamae",
          "idade",
          "endereco",
          "municipioderesidencia",
          "sexo",
          "prontuario",
          "datadoobito",
          "localdoobito",
          "causa",
        ])
        .where({ nome })
        .first();

      return result || undefined;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async findFormNome(nome) {
    try {
      const result = await knex("obitos").select("*").where({ nome }).first();

      return result !== undefined;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async updateObitos(
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
    causa
  ) {
    const obito = await this.findFormById(id);

    if (obito) {
      const editObito = {};

      if (nome && nome !== obito.nome) {
        const result = await this.findFormNome(nome);
        if (!result) {
          editObito.nome = nome;
        } else {
          return { status: false, err: "Falecido já morreu." };
        }
      }

      if (ubs) editObito.ubs = ubs;
      if (nomedamae) editObito.nomedamae = nomedamae;
      if (idade) editObito.idade = idade;
      if (endereco) editObito.endereco = endereco;
      if (municipioderesidencia)
        editObito.municipioderesidencia = municipioderesidencia;
      if (sexo) editObito.sexo = sexo;
      if (prontuario) editObito.prontuario = prontuario;
      if (datadoobito) editObito.datadoobito = datadoobito;
      if (localdoobito) editObito.localdoobito = localdoobito;
      if (causa) editObito.causa = causa;
      if (responsavel) editObito.responsavel = responsavel;

      try {
        await knex("obitos").update(editObito).where({ id });
        return { status: true };
      } catch (err) {
        return { status: false, err };
      }
    } else {
      return { status: false, err: "O formulário não existe." };
    }
  }

  async deleteObito(id) {
    const obito = await this.findFormById(id);
    if (obito) {
      try {
        await knex("obitos").delete().where({ id });
        return { status: true };
      } catch (err) {
        return { status: false, err };
      }
    } else {
      return {
        status: false,
        err: "O formulário não existe e, portanto, não pode ser deletado.",
      };
    }
  }
}

module.exports = new Obitos();
