
import express from "express";
import fileUpload from 'express-fileupload';
import sequelize from './server/db.js';
import './server/models/mapping.js';
import cors from 'cors';
import router from './server/routes/index.js';
import errorHandler from './server/middleware/ErrorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './server/config/swagger.js';

const PORT = process.env.PORT || 7000;
const app = express();

/* Middlewares */

// Разрешаем запросы с других доменов (для будущего Vue-клиента)
app.use(cors());
// Позволяет серверу понимать JSON-формат в теле запроса
app.use(express.json());
// middleware для загрузки файлов
app.use(fileUpload());
app.use(express.static('static'));

/* Swagger Documentation */
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* Подключение роутеров */
app.use('/api', router);

/* Обработка ошибок */
app.use(errorHandler);

const start = async () => {
    try{
        await sequelize.authenticate();
        console.log('Подключение успешно!');

        // Синхронизируем модели с таблицами
        // alter: true — магическая опция, которая подправит таблицы, если ты изменишь модели

        await sequelize.sync({alter: true });
        console.log(' Все таблицы базы данных синхронизированы.');

        app.listen(PORT, ()=> console.log(`Сервер работает на порту ${PORT}`));
        console.log(`Swagger документация доступна по адресу: http://localhost:${PORT}/api/docs`);
    } catch (e) {
        console.error("Не получилось подключиться", e);
    }
};

start();

