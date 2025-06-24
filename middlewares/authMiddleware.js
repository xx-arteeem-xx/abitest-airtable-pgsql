const jwt = require("jsonwebtoken");
const logger = require("../logger/logger.js");

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    };

    try {
        let token = req.headers.authorization;
        if (!token) {
            throw new Error("User unauthorized (no token)")
        };
        token = token.split(" ")[1];
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedData;
        next();
    } catch (error) {
        res.status(403).json({
            "error": error.message
        });
        logger.error({
            "error": error.message,
            "path": req.path,
            "ip": req.ip
        })
    }
}