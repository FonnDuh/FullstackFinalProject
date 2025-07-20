const morgan = require("morgan");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const currentTime = require("../../utils/timeHelper");

const logDirectory = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDirectory))
  fs.mkdirSync(logDirectory, { recursive: true });

const morganLogger = morgan(function (token, req, res) {
  const { year, month, day, hours, minutes, seconds } = currentTime();
  const logFilePath = path.join(logDirectory, `${day}-${month}-${year}.log`);
  const msg = [
    `[${day}/${month}/${year} ${hours}:${minutes}:${seconds}]`,
    token.method(req, res),
    token.url(req, res),
    token.status(req, res),
    "-",
    token["response-time"](req, res),
    "ms",
  ].join(" ");

  if (token.status(req, res) >= 400) {
    const errorText = res.locals.errorMessage
      ? ` | ${res.locals.errorMessage}`
      : "";
    fs.appendFileSync(logFilePath, msg + errorText + "\n");
    return chalk.red(msg);
  }
  if (token.status(req, res) >= 300) return chalk.yellow(msg);
  return chalk.cyanBright(msg);
});

module.exports = morganLogger;
