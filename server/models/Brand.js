import { DataTypes } from "sequelize";
import sequelize from "../db.js";

/**
 * Модель бренда
 * @typedef {Object} Brand
 * @property {string} name - Название бренда
 */
const Brand = sequelize.define(
    "brand",
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

export default Brand;
