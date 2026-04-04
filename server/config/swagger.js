import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Simple Online Store API',
        version: '1.0.0',
        description: 'API для интернет-магазина с аутентификацией и CRUD операциями',
        contact: {
            name: 'Support',
            email: 'support@example.com'
        }
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 7000}/api`,
            description: 'Локальный сервер разработки'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Введите JWT токен в формате: Bearer <ваш_токен>'
            }
        },
        schemas: {
            User: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    id: { type: 'integer', description: 'ID пользователя' },
                    email: { type: 'string', format: 'email', description: 'Email пользователя' },
                    password: { type: 'string', description: 'Пароль (минимум 6 символов)' },
                    role: { type: 'string', enum: ['USER', 'ADMIN'], default: 'USER' }
                }
            },
            Product: {
                type: 'object',
                required: ['name', 'price', 'categoryId', 'brandId'],
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    price: { type: 'number', minimum: 0 },
                    categoryId: { type: 'integer' },
                    brandId: { type: 'integer' },
                    rating: { type: 'number', minimum: 0, maximum: 5 },
                    image: { type: 'string', description: 'URL изображения' }
                }
            },
            Category: {
                type: 'object',
                required: ['name'],
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' }
                }
            },
            Brand: {
                type: 'object',
                required: ['name'],
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    errorId: { type: 'string' },
                    details: { type: 'array', items: { type: 'object' } },
                    stack: { type: 'string', description: 'Только в режиме разработки' }
                }
            }
        }
    },
    security: [{ bearerAuth: [] }]
}

const options = {
    swaggerDefinition,
    apis: ['./server/routes/*.js', './server/controllers/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
