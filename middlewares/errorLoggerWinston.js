const expressWinston = require("express-winston");
const { format, transports } = require("winston");
const { combine, timestamp, prettyPrint, metadata } = format;
const config = require("config");

const expressWinstonErrorLogger = expressWinston.errorLogger({
  transports: [
    new transports.File({ filename: "log/express_error.log", level: "error" }),
  ],
  format: combine(prettyPrint()),
});

module.exports = {
  expressWinstonErrorLogger,
};
