// Глобальные моки для bcrypt и jwt
import { jest } from '@jest/globals';

const mockHash = jest.fn();
const mockCompareSync = jest.fn();
const mockJwtSign = jest.fn();

// Моки для моделей
const mockUser = {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn()
};

const mockBasket = {
    create: jest.fn(),
    findOne: jest.fn()
};

// Экспортируем для использования в тестах
export { mockUser, mockBasket, mockHash, mockCompareSync, mockJwtSign };

// Мокируем модули
jest.mock('bcrypt', () => ({
    hash: mockHash,
    compareSync: mockCompareSync
}));

jest.mock('jsonwebtoken', () => ({
    sign: mockJwtSign
}));

jest.mock('../server/models/mapping.js', () => ({
    User: mockUser,
    Basket: mockBasket
}));
