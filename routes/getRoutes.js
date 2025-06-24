const express = require('express');
const router = express.Router();
const controller = require("../controllers/getController.js");
const roleMiddleware = require("../middlewares/roleMiddleware.js");

router.get("/", roleMiddleware(["ADMIN"]), controller.get);

module.exports = router;