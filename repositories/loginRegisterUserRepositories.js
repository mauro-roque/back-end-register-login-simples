const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');
const UserModel = require('../models/UserBdModel');
const users = UserModel(sequelize, DataTypes);

//Parte funcional registro / login 
class RepositoriesUser {
    static async insertNewUser(dadosUser) {
        try {
            const newUser = await users.create({
                nome: dadosUser.nome,
                telefone: dadosUser.telefone,
                login: dadosUser.login,
                senha: dadosUser.senha,
                fk_assinatura: 1
            });

            console.log("Usuário inserido com sucesso! ID:", newUser.id_users);
            return newUser.id_users;
        } catch (error) {
            console.error("Erro ao inserir novo usuário, usuario duplicado:", error.message);
            return 0;
        }
    }

    static async verificarUser(dados) {
        try {
            const user = await users.findOne({
                where: {
                    login: dados.email,
                    senha: dados.senha
                }
            });

            if (user) {
                console.log("Usuário encontrado:", user.nome);
                return user
            } else {
                console.log("Usuário não encontrado ou senha incorreta.");
                return false
            }

        } catch (error) {
            console.error("Erro ao verificar usuário:", error.message);
            return false;
        }
    }
}

class ConsultaUsuarios {
    static async consultarTodosUsers() {
        const [results] = await sequelize.query("SELECT * FROM users");
        return results;
    }

    static async consultarUsuarioPorId(id) {
        const resul = await sequelize.query(
            "SELECT * FROM users WHERE id_users = ?",
            {
                replacements: [id],
                type: sequelize.QueryTypes.SELECT
            }
        );
        return resul;
    }
}

sequelize.authenticate()
    .then(() => console.log("Conectado com sucesso ao banco de dados!"))
    .catch(err => console.error("Falha ao se conectar ao banco:", err));

sequelize.sync({ force: false })
    .then(() => console.log("Banco de dados sincronizado!"))
    .catch(err => console.error("Erro ao sincronizar banco de dados:", err));

module.exports = {
    RepositoriesUser,
    ConsultaUsuarios
};
