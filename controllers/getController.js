const express = require('express');
const logger = require("../logger/logger.js");
const Airtable = require('airtable');

const pgp = require('pg-promise')(/* options */)
const db = pgp(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DB}`);

function errorMessage(req, res, error) {
    res.status(400).json({
        "error": error.message
    });
    logger.error({
        "error": error.message,
        "path": req.path,
        "ip": req.ip
    });
};

function successMessage(req, res, message){
    res.status(200).json({
        message
    });
    logger.info({
        "path": req.path,
        "ip": req.ip
    });
};

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
            successMessage(req, res, message);
        } catch (error) {
            errorMessage(req, res, error)
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
            db.query(`
                CREATE TABLE IF NOT EXISTS questions (
                    id INTEGER PRIMARY KEY,
                    parentid INTEGER,
                    level INTEGER,
                    sorting INTEGER,
                    question TEXT,
                    answer TEXT,
                    isterminal TEXT
                );
            `)
                .then(function (data) {
                    const values = [];
                    const placeholders = records.map((record, index) => {
                        const i = index * 7;
                        values.push(
                            record.fields.ID,
                            record.fields.ParentID,
                            parseInt(record.fields.Level),
                            record.fields.Sorting,
                            record.fields.Question,
                            record.fields.Answer,
                            record.fields.IsTerminal
                        );
                        return `($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5}, $${i + 6}, $${i + 7})`
                    }).join(', ');
                        const query = `
                        INSERT INTO questions (id, parentid, level, sorting, question, answer, isterminal)
                        VALUES ${placeholders}
                        ON CONFLICT (id) DO UPDATE SET
                            parentid = EXCLUDED.parentid,
                            level = EXCLUDED.level,
                            sorting = EXCLUDED.sorting,
                            question = EXCLUDED.question,
                            answer = EXCLUDED.answer,
                            isterminal = EXCLUDED.isterminal;
                        `;
                    db.query(query, values)
                        .then(function(data) {
                            let message = "Data in DB!"
                            successMessage(req, res, message)
                        })
                        .catch(function(error) {
                            errorMessage(req, res, error)
                        })
                })
                .catch(function(error) {
                    errorMessage(req, res, error)
                })
        }, function done(error) {
            if (error) {
                errorMessage(req, res, error);
            };
        });
    }
}

module.exports = new CalcController();