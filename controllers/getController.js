const express = require('express');
const logger = require("../logger/logger.js");

class CalcController {
    // || МЕТОД 0. При переходе на страницу "/api/calc/" Выдаем приветственное сообщение ||
    // || Пример ответа: 
    // {
    //     "message": "Hello!!!"
    // }
    get(req, res) {
        try {
            let message = "Hello!!!"
            // _______________ ОТПРАВЛЯЕМ ДАННЫЕ ____________________________________
            res.status(200).json({
                message
            });
            logger.info({
                "path": req.path,
                "ip": req.ip
            });
        } catch (error) {
            // _______________ ЕСЛИ НАШЛИ ОШИБКУ ____________________________________
            res.status(400).json({
                "error": error.message
            });
            logger.error({
                "error": error.message,
                "path": req.path,
                "ip": req.ip
            });
        }
    }
}

module.exports = new CalcController();