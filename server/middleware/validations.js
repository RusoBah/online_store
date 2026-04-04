import { body, param, query } from 'express-validator'

// Валидация для пользователя
export const userValidation = {
    signup: [
        body('email')
            .isEmail()
            .withMessage('Некорректный email')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Пароль должен содержать минимум 6 символов'),
        body('role')
            .optional()
            .isIn(['USER', 'ADMIN'])
            .withMessage('Недопустимая роль')
    ],
    login: [
        body('email')
            .isEmail()
            .withMessage('Некорректный email')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Пароль обязателен')
    ],
    update: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом'),
        body('email')
            .optional()
            .isEmail()
            .withMessage('Некорректный email')
            .normalizeEmail(),
        body('password')
            .optional()
            .isLength({ min: 6 })
            .withMessage('Пароль должен содержать минимум 6 символов'),
        body('role')
            .optional()
            .isIn(['USER', 'ADMIN'])
            .withMessage('Недопустимая роль')
    ],
    delete: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID пользователя для удаления должен быть положительным числом')
    ],
    getOne: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом')
    ]
}

// Валидация для товара
export const productValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage('Название товара обязательно')
            .isLength({ min: 2, max: 255 })
            .withMessage('Название должно быть от 2 до 255 символов'),
        body('price')
            .notEmpty()
            .withMessage('Цена обязательна')
            .isFloat({ min: 0 })
            .withMessage('Цена должна быть положительным числом'),
        body('categoryId')
            .notEmpty()
            .withMessage('Категория обязательна')
            .isInt({ min: 1 })
            .withMessage('ID категории должен быть положительным числом'),
        body('brandId')
            .notEmpty()
            .withMessage('Бренд обязателен')
            .isInt({ min: 1 })
            .withMessage('ID бренда должен быть положительным числом')
    ],
    update: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом'),
        body('name')
            .optional()
            .isLength({ min: 2, max: 255 })
            .withMessage('Название должно быть от 2 до 255 символов'),
        body('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Цена должна быть положительным числом'),
        body('categoryId')
            .optional()
            .isInt({ min: 1 })
            .withMessage('ID категории должен быть положительным числом'),
        body('brandId')
            .optional()
            .isInt({ min: 1 })
            .withMessage('ID бренда должен быть положительным числом'),
        body('rating')
            .optional()
            .isFloat({ min: 0, max: 5 })
            .withMessage('Рейтинг должен быть от 0 до 5')
    ],
    getOne: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом')
    ],
    delete: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом')
    ]
}

// Валидация для бренда
export const brandValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage('Название бренда обязательно')
            .isLength({ min: 2, max: 255 })
            .withMessage('Название должно быть от 2 до 255 символов')
    ],
    update: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом'),
        body('name')
            .optional()
            .isLength({ min: 2, max: 255 })
            .withMessage('Название должно быть от 2 до 255 символов')
    ],
    getOne: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом')
    ],
    delete: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом')
    ]
}

// Валидация для категории
export const categoryValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage('Название категории обязательно')
            .isLength({ min: 2, max: 255 })
            .withMessage('Название должно быть от 2 до 255 символов')
    ],
    update: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом'),
        body('name')
            .optional()
            .isLength({ min: 2, max: 255 })
            .withMessage('Название должно быть от 2 до 255 символов')
    ],
    getOne: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом')
    ],
    delete: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID должен быть положительным числом')
    ]
}

// Валидация для пагинации
export const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Страница должна быть положительным числом'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Лимит должен быть от 1 до 100'),
    query('brandId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID бренда должен быть положительным числом'),
    query('categoryId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID категории должен быть положительным числом')
]
