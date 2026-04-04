
import express from "express";
import sequelize from './server/db.js'; // конфиги 
import './server/models/mapping.js';
import cors from 'cors';
import router from './server/routes/index.js';



const PORT = process.env.PORT || 5000;
const app = express();

/* Middlewares */

// Разрешаем запросы с других доменов (для будущего Vue-клиента)
app.use(cors());
// Позволяет серверу понимать JSON-формат в теле запроса
app.use(express.json());
// middleware для загрузки файлов
app.use(fileUpload());
app.use(express.static('static'));

/* Подключение роутеров */
app.use('/api', router);

const start = async () => {
    try{
        await sequelize.authenticate();
        console.log('Подключение успешно!');

        // Синхронизируем модели с таблицами
        // alter: true — магическая опция, которая подправит таблицы, если ты изменишь модели

        await sequelize.sync({alter: true });
        console.log(' Все таблицы базы данных синхронизированы.');

        app.listen(PORT, ()=> console.log(`Сервер работает на порту ${PORT}`));
    } catch (e) {
        console.error("Не получилось подключиться", e);
    }
};

start();

