# 🛒 Simple Online Store (Fullstack)

Fullstack интернет-магазин на **Node.js + Express + PostgreSQL + Sequelize + Vue 3 + Vite**.

Проект включает:
- backend API для товаров, категорий, брендов и пользователей
- frontend-панель для вывода товаров, авторизации администратора, добавления/удаления товаров
- локальную корзину на клиенте со счётчиком и управлением количества через `+` / `-`

---

## 🚀 Быстрый старт

### 1. Установка зависимостей backend
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

### 3. Запуск backend
```bash
# Режим разработки (с nodemon)
npm run dev

# Обычный запуск
node index.js
```

Сервер запустится на **http://localhost:7000**

### 4. Запуск frontend
```bash
cd client
npm install
npm run dev
```

Frontend будет доступен на **http://localhost:5173**  
В `vite.config.ts` настроен proxy на backend для `/api` и `/static`.

---

## 📁 Структура проекта

```text
market/
├── index.js                    # Точка входа backend
├── package.json
├── test.http                   # Тестовые запросы
├── client/                     # Vue 3 + Vite frontend
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── style.css
│   │   └── components/
│   │       ├── catalog_list.vue
│   │       └── authorization/
│   │           └── auth_form.vue
│   └── vite.config.ts
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

## 🖥 Frontend (Vue)

### Что реализовано
- Вывод товаров из `GET /api/product/getall`
- Фильтрация по категории и бренду
- Добавление товара через `POST /api/product/create` (только ADMIN)
- Удаление товара через `DELETE /api/product/delete/:id` (только ADMIN)
- Авторизация администратора через `POST /api/user/login`
- Автосохранение JWT после авторизации (без ручного ввода токена)
- Шапка с иконкой корзины и общим счётчиком товаров
- Кнопка `В корзину`, затем управление количеством через `+` и `-`
- Счётчик количества в карточке read-only (меняется только кнопками)

### Примечания по авторизации
- Для `create/delete` нужен пользователь с ролью `ADMIN`
- JWT берется автоматически после логина и отправляется в `Authorization: Bearer <token>`

---

## 📡 API Reference

### Базовый URL
```text
http://localhost:7000/api
```

### 📦 Товары (`/api/product`)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/product/getall` | Список товаров (с фильтрацией и пагинацией) |
| GET | `/product/getone/:id` | Детальная информация о товаре |
| POST | `/product/create` | Создание товара (с изображением) |
| PUT | `/product/update/:id` | Обновление товара |
| DELETE | `/product/delete/:id` | Удаление товара |

**Пример запроса — получение товаров:**
```text
GET /api/product/getall?brandId=1&categoryId=1&limit=9&page=1
```

### 📂 Категории (`/api/category`)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/category/getall` | Список всех категорий |
| GET | `/category/getone/:id` | Детальная информация о категории |
| POST | `/category/create` | Создание категории |
| PUT | `/category/update/:id` | Обновление категории |
| DELETE | `/category/delete/:id` | Удаление категории |

### 🏷 Бренды (`/api/brand`)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/brand/getall` | Список всех брендов |
| GET | `/brand/getone/:id` | Детальная информация о бренде |
| POST | `/brand/create` | Создание бренда |
| PUT | `/brand/update/:id` | Обновление бренда |
| DELETE | `/brand/delete/:id` | Удаление бренда |

### 👤 Пользователи (`/api/user`)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/user/signup` | Регистрация (возвращает JWT-токен) |
| POST | `/user/login` | Вход (возвращает JWT-токен) |
| GET | `/user/check` | Проверка авторизации (требуется токен) |

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
| **Vue 3 + Vite** | Клиентская часть и проксирование API |

---

## 🧪 Тестирование

Файл **`test.http`** содержит готовые запросы для тестирования backend через HTTP Client в VS Code.

Базовый сценарий проверки:
1. Создать категорию
2. Создать бренд
3. Зарегистрировать/войти пользователем `ADMIN`
4. Авторизоваться на frontend
5. Создать и удалить товар из UI

---

## 📊 Статус проекта

| Компонент | Готовность |
|-----------|------------|
| Товары (CRUD) | ✅ 100% |
| Категории (CRUD) | ✅ 100% |
| Бренды (CRUD) | ✅ 100% |
| Пользователи | ✅ 70% |
| Аутентификация | ✅ 90% |
| Авторизация (роли) | ✅ 80% |
| Frontend (админ-каталог) | ✅ 85% |

**Общий прогресс:** ~90%

---

## 📝 Следующие шаги

- [ ] Добавить редактирование товара на frontend
- [ ] Подключить серверную корзину вместо локальной
- [ ] Добавить e2e тесты для сценария login/create/delete
- [ ] Добавить страницу профиля администратора

---

## 📄 Лицензия

Учебный проект
