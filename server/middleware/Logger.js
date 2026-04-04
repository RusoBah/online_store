import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, '../../logs');
const errorLogFile = path.join(logDir, 'error.log');
const infoLogFile = path.join(logDir, 'info.log');

// Создаем директорию для логов если не существует
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Класс Logger для централизованного логирования событий и ошибок
 */
class Logger {
    /**
     * Логирует информационное сообщение
     * @param {string} message - Сообщение для логирования
     */
    static info(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[INFO] [${timestamp}] ${message}\n`;
        console.info(logMessage.trim());
        this._writeToFile(infoLogFile, logMessage);
    }

    /**
     * Логирует предупреждение
     * @param {string} message - Сообщение для логирования
     */
    static warn(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[WARN] [${timestamp}] ${message}\n`;
        console.warn(logMessage.trim());
        this._writeToFile(errorLogFile, logMessage);
    }

    /**
     * Логирует ошибку
     * @param {string} message - Сообщение для логирования
     * @param {Error} [error] - Объект ошибки (необязательно)
     */
    static error(message, error) {
        const timestamp = new Date().toISOString();
        let logMessage = `[ERROR] [${timestamp}] ${message}\n`;
        
        if (error) {
            logMessage += `  Type: ${error.name}\n`;
            logMessage += `  Message: ${error.message}\n`;
            if (error.stack) {
                logMessage += `  Stack: ${error.stack}\n`;
            }
        }
        
        console.error(logMessage.trim());
        this._writeToFile(errorLogFile, logMessage);
    }

    /**
     * Записывает сообщение в файл
     * @param {string} filePath - Путь к файлу лога
     * @param {string} message - Сообщение для записи
     * @private
     */
    static _writeToFile(filePath, message) {
        try {
            fs.appendFileSync(filePath, message, 'utf8');
        } catch (e) {
            console.error('Не удалось записать в лог-файл:', e.message);
        }
    }
}

export default Logger;
