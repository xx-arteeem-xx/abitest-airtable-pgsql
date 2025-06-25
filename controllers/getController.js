const express = require('express');
const logger = require("../logger/logger.js");
const Airtable = require('airtable');

var base = new Airtable({apiKey: process.env.AIRTABLE_TOKEN}).base(process.env.AIRTABLE_BASE);

class CalcController {
    // || МЕТОД 0. При переходе на страницу "/api/get/" Выдаем приветственное сообщение ||
    // || Пример ответа: 
    // {
    //     "message": "Hello!!!"
    // }
    get(req, res) {
        try {
            let message = "Hello!!!";
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

    // || МЕТОД 1. При переходе на страницу "/api/get/update"  ||
    // || Пример ответа: 
    // {
    //     "message": "Hello!!!"
    // }
    update(req, res) {
        base('Questions').select({
            view: "Grid"
        }).eachPage(function page(records, fetchNextPage) {
            // _______________ ОТПРАВЛЯЕМ ДАННЫЕ ____________________________________
            res.status(200).json({
                records
            });
            logger.info({
                "path": req.path,
                "ip": req.ip
            });
            fetchNextPage();

        }, function done(error) {
            // _______________ ЕСЛИ НАШЛИ ОШИБКУ ____________________________________
            res.status(400).json({
                "error": error.message
            });
            logger.error({
                "error": error.message,
                "path": req.path,
                "ip": req.ip
            });
        });
    }
}

module.exports = new CalcController();