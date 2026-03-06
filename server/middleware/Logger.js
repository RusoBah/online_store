/**
 * Класс Logger для централизованного логирования событий и ошибок
 */
class Logger {
    /**
     * Логирует информационное сообщение
     * @param {string} message - Сообщение для логирования
     */
    static info(message) {
        console.info(`[INFO] [${new Date().toISOString()}] ${message}`);
    }

    /**
     * Логирует предупреждение
     * @param {string} message - Сообщение для логирования
     */
    static warn(message) {
        console.warn(`[WARN] [${new Date().toISOString()}] ${message}`);
    }

    /**
     * Логирует ошибку
     * @param {string} message - Сообщение для логирования
     * @param {Error} [error] - Объект ошибки (необязательно)
     */
    static error(message, error) {
        console.error(`[ERROR] [${new Date().toISOString()}] ${message}`);
        if (error && error.stack) {
            console.error(error.stack);
        }
    }
}

export default Logger;
