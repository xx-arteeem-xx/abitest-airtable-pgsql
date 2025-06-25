const express = require('express');
const router = express.Router();
const controller = require("../controllers/getController.js");
const roleMiddleware = require("../middlewares/roleMiddleware.js");

router.get("/", roleMiddleware(["ADMIN"]), controller.get);
router.get("/update", roleMiddleware(["ADMIN"]), controller.update);

module.exports = router;