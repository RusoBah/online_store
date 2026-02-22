import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Магия для определения путей в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Явно указываем путь к файлу .env, который лежит в той же папке, что и db.js
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('DEBUG: Пароль в db.js ->', process.env.DB_PASS);
/**
 * Экземпляр подключения
 */

export default new Sequelize (
    process.env.DB_NAME,
    process.env.DB_USER,
    String(process.env.DB_PASS || ""), // Защита от undefined
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false, // Отключаем вывод SQL-запросов в консоль для чистоты
        define: {
            // Превращает camelCase в snake_case в таблицах (createdAt -> created_at)
            underscored: true, 
        }
    }
);