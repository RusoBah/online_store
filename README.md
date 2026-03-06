# 🛒 Simple Online Store (Backend)

Backend для интернет-магазина на **Node.js + Express + PostgreSQL + Sequelize**.

Поддерживает управление товарами, категориями, брендами и пользователями. Включает аутентификацию на JWT, загрузку файлов и централизованную обработку ошибок.

---

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка окружения
Создайте файл `.env` в папке `server/`:

```env
PORT=7000

# Настройки БД
DB_HOST=localhost
DB_NAME=online_store
DB_USER=postgres
DB_PASS=ваш_пароль
DB_PORT=5432

# Ключ для JWT (обязательно для аутентификации)
SECRET_KEY=ваш_секретный_ключ
```

### 3. Запуск сервера
```bash
# Режим разработки (с nodemon)
npm run dev

# Обычный запуск
node index.js
```

Сервер запустится на **http://localhost:7000**

---

## 📁 Структура проекта

```
market/
├── index.js                    # Точка входа
├── package.json
├── test.http                   # Тестовые запросы
├── server/
│   ├── .env                    # Переменные окружения
│   ├── db.js                   # Подключение к PostgreSQL
│   ├── models/
│   │   ├── mapping.js          # Модели и связи Sequelize
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Brand.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── brandController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── product.js
│   │   ├── category.js
│   │   ├── brand.js
│   │   └── user.js
│   ├── middleware/
│   │   ├── Logger.js
│   │   ├── ErrorHandler.js
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── services/
│   │   ├── FileService.js
│   │   ├── ProductService.js
│   │   └── UserService.js
│   └── errors/
│       └── AppError.js
└── static/                     # Загруженные файлы
```

---

## 📡 API Reference

### Базовый URL
```
http://localhost:7000/api
```

---

### 📦 Товары (`/api/product`)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/product/getall` | Список товаров (с фильтрацией и пагинацией) |
| GET | `/product/getone/:id` | Детальная информация о товаре |
| POST | `/product/create` | Создание товара (с изображением) |
| PUT | `/product/update/:id` | Обновление товара |
| DELETE | `/product/delete/:id` | Удаление товара |

**Пример запроса — получение товаров:**
```
GET /api/product/getall?brandId=1&categoryId=1&limit=9&page=1
```

**Пример создания товара:**
```http
POST http://localhost:7000/api/product/create
Content-Type: application/json

{
    "name": "Asus Zenbook",
    "price": 120000,
    "categoryId": 1,
    "brandId": 1
}
```

---

### 📂 Категории (`/api/category`)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/category/getall` | Список всех категорий |
| GET | `/category/getone/:id` | Детальная информация о категории |
| POST | `/category/create` | Создание категории |
| PUT | `/category/update/:id` | Обновление категории |
| DELETE | `/category/delete/:id` | Удаление категории |

**Пример создания:**
```http
POST http://localhost:7000/api/category/create
Content-Type: application/json

{
    "name": "Ноутбуки"
}
```

---

### 🏷 Бренды (`/api/brand`)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/brand/getall` | Список всех брендов |
| GET | `/brand/getone/:id` | Детальная информация о бренде |
| POST | `/brand/create` | Создание бренда |
| PUT | `/brand/update/:id` | Обновление бренда |
| DELETE | `/brand/delete/:id` | Удаление бренда |

**Пример создания:**
```http
POST http://localhost:7000/api/brand/create
Content-Type: application/json

{
    "name": "Asus"
}
```

---

### 👤 Пользователи (`/api/user`)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/user/signup` | Регистрация (возвращает JWT-токен) |
| POST | `/user/login` | Вход (возвращает JWT-токен) |
| GET | `/user/check` | Проверка авторизации (требуется токен) |

**Пример регистрации:**
```http
POST http://localhost:7000/api/user/signup
Content-Type: application/json

{
    "email": "admin@mail.ru",
    "password": "password123",
    "role": "ADMIN"
}
```

**Ответ:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Пример проверки авторизации:**
```http
GET http://localhost:7000/api/user/check
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 Технические особенности

| Компонент | Описание |
|-----------|----------|
| **Sequelize ORM** | Модели с связями, синхронизация `{ alter: true }` |
| **JWT Authentication** | Токены с сроком действия 24 часа |
| **Bcrypt** | Хэширование паролей (5 циклов) |
| **express-fileupload** | Загрузка изображений товаров |
| **CORS** | Разрешены кросс-доменные запросы |
| **ErrorHandler** | Централизованная обработка ошибок |
| **Logger** | Логирование запросов и ошибок |

---

## 🧪 Тестирование

Файл **`test.http`** содержит готовые запросы для тестирования через HTTP Client в VS Code.

**Порядок тестирования:**
1. Создайте категорию
2. Создайте бренд
3. Зарегистрируйте пользователя
4. Войдите в систему (получите токен)
5. Создайте товар

---

## 📦 Зависимости

```json
{
  "bcrypt": "^6.0.0",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1",
  "express": "^5.2.1",
  "express-fileupload": "^1.5.2",
  "jsonwebtoken": "^9.0.3",
  "pg": "^8.18.0",
  "pg-hstore": "^2.3.4",
  "sequelize": "^6.37.7",
  "uuid": "^13.0.0"
}
```

**Dev-зависимости:**
```json
{
  "nodemon": "^3.1.14"
}
```

---

## 📊 Статус проекта

| Компонент | Готовность |
|-----------|------------|
| Товары (CRUD) | ✅ 100% |
| Категории (CRUD) | ✅ 100% |
| Бренды (CRUD) | ✅ 100% |
| Пользователи | ✅ 60% |
| Аутентификация | ✅ 80% |
| Авторизация (роли) | ⚠️ 50% |

**Общий прогресс:** ~85%

Подробности в файле [STATUS.md](STATUS.md)

---

## 📝 Следующие шаги

- [ ] Подключить authMiddleware к защищённым роутам
- [ ] Подключить adminMiddleware к админским операциям
- [ ] Добавить валидацию входных данных
- [ ] Реализовать полный CRUD пользователей

---

## 📄 Лицензия

Учебный проект
