import { Brand } from '../models/mapping.js';

class BrandController {
    /**
     * Получает список всех брендов из БД.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    async getAll(req,res) {
        try{
            const brands = await Brand.findAll();
            res.json(brands);
        } catch (e){
            res.status(500).json({ message: "Ошибка при получении брендов: " + e.message });
        }
    }

    /**
     * Получает данные одного бренда по его идентификатору.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    async getOne(req, res) {
        try{
            const { id } = req.params;
            const brand = await Brand.findByPk(id);

            if (!brand) 
                return res.status(404).json({message: 'Бренд не найден'});

            res.json(brand);
        } catch (e) {
            res.status(500).json({ message: "Ошибка сервера: " + e.message });
        }
    }

    /**
     * Создает новый бренд.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async create(req, res) {
        try {
            const { name } = req.body;
            const brand = await Brand.create({ name });
            res.status(201).json(brand);
        } catch (e) {
            res.status(400).json({ message: "Не удалось создать бренд: " + e.message });
        }
    }
}


export default new BrandController();