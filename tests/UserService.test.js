import { describe, it, expect, beforeEach } from '@jest/globals';
import { mockUser, mockBasket, mockHash, mockCompareSync, mockJwtSign } from './mocks.js';
import UserService from '../server/services/UserService.js';

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUser.findOne.mockReset();
        mockUser.create.mockReset();
        mockUser.findByPk.mockReset();
        mockUser.findAll.mockReset();
        mockBasket.create.mockReset();
        mockBasket.findOne.mockReset();
        mockHash.mockReset();
        mockCompareSync.mockReset();
        mockJwtSign.mockReset();
    });

    describe('signup', () => {
        it('должен выбросить ошибку при существующем email', async () => {
            mockUser.findOne.mockResolvedValue({ id: 1, email: 'existing@example.com' });

            await expect(UserService.signup('existing@example.com', 'password123'))
                .rejects
                .toThrow('Пользователь с таким email уже существует');
        });

        it('должен выбросить ошибку при пустом email', async () => {
            await expect(UserService.signup('', 'password123'))
                .rejects
                .toThrow('Некорректные данные для регистрации');
        });

        it('должен выбросить ошибку при пустом пароле', async () => {
            await expect(UserService.signup('test@example.com', ''))
                .rejects
                .toThrow('Некорректные данные для регистрации');
        });
    });

    describe('login', () => {
        it('должен выбросить ошибку при несуществующем email', async () => {
            mockUser.findOne.mockResolvedValue(null);

            await expect(UserService.login('nonexistent@example.com', 'password123'))
                .rejects
                .toThrow('Пользователь с таким email не найден');
        });

        it('должен выбросить ошибку при неверном пароле', async () => {
            mockUser.findOne.mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                password: 'hashedPassword'
            });
            mockCompareSync.mockReturnValue(false);

            await expect(UserService.login('test@example.com', 'wrongpassword'))
                .rejects
                .toThrow('Неверный пароль');
        });
    });

    describe('getOne', () => {
        it('должен выбросить ошибку при несуществующем пользователе', async () => {
            mockUser.findByPk.mockResolvedValue(null);

            await expect(UserService.getOne(999))
                .rejects
                .toThrow('Пользователь не найден');
        });
    });

    describe('update', () => {
        it('должен выбросить ошибку при несуществующем пользователе', async () => {
            mockUser.findByPk.mockResolvedValue(null);

            await expect(UserService.update(999, { email: 'new@example.com' }))
                .rejects
                .toThrow('Пользователь не найден');
        });
    });

    describe('delete', () => {
        it('должен выбросить ошибку при несуществующем пользователе', async () => {
            mockUser.findByPk.mockResolvedValue(null);

            await expect(UserService.delete(999))
                .rejects
                .toThrow('Пользователь не найден');
        });
    });
});
