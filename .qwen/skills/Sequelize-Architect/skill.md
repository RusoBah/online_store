# Skill: Sequelize Backend Architect

## Описание
Этот навык предназначен для разработки и рефакторинга бекенда на Node.js, Express и Sequelize в рамках проекта Simple Online Store.

## Основные инструкции
1. **Импорт моделей**: Всегда импортируй модели из центрального файла `mapping.js`. Не импортируй файлы моделей напрямую из папки models [4, 7].
2. **Безопасность (Приоритет)**: 
   - При создании защищенных роутов (POST, PUT, DELETE) обязательно добавляй `authMiddleware` [6].
   - Для административных действий (управление категориями, брендами, товарами) добавляй `adminMiddleware` [5, 6].
3. **Обработка ошибок**: Используй существующий класс `ApiError` и передавай ошибки в `next(ApiError.badRequest(...))` для корректной работы `ErrorHandler` [3].
4. **Валидация**: Перед выполнением запроса к БД проверяй корректность данных:
   - Цена (price) должна быть > 0 [8].
   - Email должен соответствовать формату.
5. **Связи**: При запросах `getall` или `getone` учитывай связи (Include), настроенные в `mapping.js` (например, связь Product с Brand и Category) [4].

## Примеры кода
Пример создания защищенного контроллера:
```javascript
// Используй mapping.js
const { Product } = require('../models/mapping')
const ApiError = require('../error/ApiError')

// Пример метода с проверкой прав
async create(req, res, next) {
    try {
        const { name, price, brandId, categoryId } = req.body
        if (!price || price <= 0) return next(ApiError.badRequest('Некорректная цена'))
        // Логика создания...
    } catch (e) {
        next(ApiError.badRequest(e.message))
    }
}