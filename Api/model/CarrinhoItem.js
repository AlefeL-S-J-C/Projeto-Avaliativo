const { DataTypes } = require('sequelize');
const db = require('../db/conn.js');

const CarrinhoItem = db.define('CarrinhoItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    carrinhoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'item_carrinho'
    },
    produtoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'item_carrinho'
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    precoUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    }
});

module.exports = CarrinhoItem;
