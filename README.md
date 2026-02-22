<h1>🛒 Simple Online Store (Backend)</h1>

<p>
Это учебный проект интернет-магазина, построенный на стеке 
<strong>Node.js + Express + PostgreSQL</strong>. 
В текущей итерации проект обновлен с учетом стандартов 2026 года 
и подготовлен для интеграции с фронтендом на Vue.js.
</p>

<hr>

<h2>🛠 Технологический стек</h2>
<ul>
  <li><strong>Runtime:</strong> Node.js v23+ (ES Modules)</li>
  <li><strong>Framework:</strong> Express.js</li>
  <li><strong>Database:</strong> PostgreSQL</li>
  <li><strong>ORM:</strong> Sequelize</li>
  <li><strong>Environment:</strong> dotenv для управления конфигурацией</li>
</ul>

<hr>

<h2>📂 Структура проекта</h2>
<strong style="color:red">Пока не готова🔴</strong>

<hr>

<h2>🚀 Быстрый старт</h2>

<h3>1. Подготовка базы данных</h3>
<p>
Убедитесь, что у вас установлен PostgreSQL. 
Создайте базу данных с названием <strong>online_store</strong> 
через pgAdmin или терминал.
</p>

<h3>2. Настройка окружения</h3>
<p>
Создайте файл <code>server/.env</code> и заполните его по шаблону:
</p>

<pre><code>PORT=5000
DB_NAME=online_store
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
</code></pre>

<h3>3. Установка зависимостей</h3>
<p>Из корневой директории выполните:</p>

<pre><code>npm install</code></pre>

<h3>4. Запуск в режиме разработки</h3>
<p>
Сервер запустится с автоматической перезагрузкой при изменениях (nodemon):
</p>

<pre><code>npm run dev</code></pre>

<hr>

<h2>🛰 API Endpoints (Текущие)</h2>
<ul>
  <li>
    <strong>GET /api/product</strong> — Проверка работоспособности каталога.
  </li>
</ul>

<hr>

<h2>📝 Заметки по разработке</h2>
<ul>
  <li>
    <strong>Синхронизация БД:</strong> Используется режим 
    <code>{ alter: true }</code>, который автоматически обновляет структуру 
    таблиц при изменении моделей в <code>mapping.js</code>.
  </li>
  <li>
    <strong>CORS:</strong> Настроен для взаимодействия с фронтенд-приложениями (Vue).
  </li>
</ul>
