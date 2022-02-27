const fs = require('fs');

const IS_DEV_MODE = process.env.NODE_ENV !== "production";

const logsDir = "./logs";
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

function getTime() {
    let now = new Date();
    return now.toLocaleString();
}

function doLog(level, ...args) {
    const strs = args.map((arg) =>
        typeof arg === "string" ? arg : JSON.stringify(arg)
    );
    var line = strs.join(" | ");
    line = `${getTime()} - ${level} - ${line}\n`;
    fs.appendFileSync("./logs/backend.log", line);
    if (IS_DEV_MODE) console.log(line);
}

module.exports = {
    debug(...args) {
        if (IS_DEV_MODE) doLog("DEBUG", ...args);
    },
    info(...args) {
        doLog("INFO", ...args);
    },
    warn(...args) {
        doLog("WARN", ...args);
    },
    error(...args) {
        doLog("ERROR", ...args);
    },
};
