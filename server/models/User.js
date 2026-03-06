import { DataTypes } from "sequelize";
import sequelize from "../db.js";

/**
 * Модель пользователя
 * @typedef {Object} User
 * @property {string} email - Email пользователя
 * @property {string} password - Хэш пароля пользователя
 * @property {string} role - Роль пользователя (например, 'USER', 'ADMIN')
 */
const User = sequelize.define(
    "user",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "USER",
            allowNull: false,
        },
    },
    {}
);

export default User;
