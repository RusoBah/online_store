import { DataTypes } from "sequelize";
import sequelize from "../db.js";

/**
 * Модель товара
 * @typedef {Object} Product
 * @property {string} name - Название товара
 * @property {number} price - Цена товара
 * @property {number} rating - Рейтинг товара
 * @property {string} image - Путь к изображению
 */
const Product = sequelize.define(
    "product",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {}
);

export default Product;
