const sequelize = require('../config/sequelize'); // Importando a instância do Sequelize
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
      id_users: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nome: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      telefone: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      login: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true
      },
      senha: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      fk_assinatura: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'assinatura', // Nome da tabela no banco
          key: 'id_assinatura'
        }
      }
    }, {
      tableName: 'users',
      timestamps: false,
      underscored: true // permite usar snake_case no DB
    });
  
    return Users;
  };
  