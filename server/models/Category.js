import { DataTypes } from "sequelize";
import sequelize from "../db.js";

/**
 * Модель категории
 * @typedef {Object} Category
 * @property {string} name - Название категории
 */
const Category = sequelize.define(
    "category",
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
    },
    {}
);

export default Category;
