import sequelize from '../db.js';
import { DataTypes } from 'sequelize';
import User from './User.js';
import Product from './Product.js';
import Category from './Category.js';
import Brand from './Brand.js';

/**
 * Модель корзина
 */
const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

/**
 * Промежуточная таблица корзина-товар
 */
const BasketProduct = sequelize.define('basket_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

/* --- Связи (Associations) --- */

User.hasOne(Basket);
Basket.belongsTo(User);

Category.hasMany(Product);
Product.belongsTo(Category);

Brand.hasMany(Product);
Product.belongsTo(Brand);

Basket.belongsToMany(Product, { through: BasketProduct });
Product.belongsToMany(Basket, { through: BasketProduct });

export {
    User,
    Basket,
    BasketProduct,
    Product,
    Category,
    Brand
};
