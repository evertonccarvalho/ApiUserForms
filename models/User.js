const knex = require("../database/connection");
const bcrypt = require("bcrypt");

class User {
  // Encontra todos os usuários
  async findAll() {
    try {
      const result = await knex
        .select(["id", "email", "role", "name", "ubs", "profilePicture"])
        .table("users");
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Encontra um usuário pelo ID
  async findById(id) {
    try {
      const result = await knex
        .select(["id", "email", "role", "name", "ubs", "profilePicture"])
        .where({ id: id })
        .table("users");
      return result[0] || undefined;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Encontra um usuário pelo email
  async findByEmail(email) {
    try {
      const result = await knex
        .select([
          "id",
          "email",
          "password",
          "role",
          "name",
          "ubs",
          "profilePicture",
        ])
        .where({ email })
        .table("users");

      return result[0] || undefined;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Cria um novo usuário
  async new(email, password, name, ubs) {
    try {
      const hash = await bcrypt.hash(password, 10);
      await knex
        .insert({ email, password: hash, name, ubs, role: 0 })
        .table("users");
    } catch (err) {
      throw new Error(err);
    }
  }

  // Verifica se um email já está em uso
  async findEmail(email) {
    try {
      const result = await knex.select("*").from("users").where({ email });

      return result.length > 0;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Atualiza informações de um usuário
  async update(id, email, name, role, ubs, profilePicture) {
    const user = await this.findById(id);

    if (user) {
      const editUser = {};

      if (email && email !== user.email) {
        const emailExists = await this.findEmail(email);
        if (!emailExists) {
          editUser.email = email;
        } else {
          return { status: false, err: "O e-mail já está cadastrado" };
        }
      }

      if (name) {
        editUser.name = name;
      }

      if (role) {
        editUser.role = role;
      }

      if (ubs) {
        editUser.ubs = ubs;
      }

      if (profilePicture) {
        editUser.profilePicture = profilePicture;
      }

      try {
        await knex.transaction(async (trx) => {
          await trx("users").update(editUser).where({ id });
        });

        return { status: true };
      } catch (err) {
        throw new Error(err);
      }
    } else {
      return { status: false, err: "O usuário não existe!" };
    }
  }

  // Exclui um usuário
  async delete(id) {
    const user = await this.findById(id);
    if (user) {
      try {
        await knex.transaction(async (trx) => {
          await trx("users").delete().where({ id });
        });

        return { status: true };
      } catch (err) {
        throw new Error(err);
      }
    } else {
      return {
        status: false,
        err: "O usuário não existe, portanto não pode ser deletado.",
      };
    }
  }

  // Define um token como utilizado
  async setUsed(token) {
    await knex("passwordtokens").update({ used: 1 }).where({ token });
  }

  // Altera a senha de um usuário
  async changePassword(newPassword, id, token) {
    const hash = await bcrypt.hash(newPassword, 10);
    await knex("users").update({ password: hash }).where({ id });
    await this.setUsed(token);
  }
}

module.exports = new User();
