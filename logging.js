"use strict";
let fs = require('fs');

let errorLogFile = "./logs/error.log";
let consoleLogFile = "./logs/console.log";
let keywordLogFile = "./logs/KeyWord.log";

let date = new Date();
let timestamp;
// create date for timestamp in logging


if (!fs.existsSync(`./logs/`)) fs.mkdirSync(`./logs/`);
if (!fs.existsSync(`./logs/old/`)) fs.mkdirSync(`./logs/old/`);

fs.readdir("./logs/", (err, files) => {
    if (err) return error(err);

    // timestamp for log directory
    date = new Date();
    let logstamp = (`${(date.getMonth()+1).toString().padStart(2, '0')}_${date.getDate().toString().padStart(2, '0')}_${date.getFullYear().toString().padStart(4, '0')} ${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`);

    let logfile = files.filter(f => f.split(".").pop() === "log");
    if (logfile.length <= 0) {
        return bot(`${botprefix} Keine Logs vorhanden!`);
    };
    // create folder
    fs.mkdirSync(`./logs/old/${logstamp}`);
    logfile.forEach(file => {
        var oldPath = `./logs/${file}`;
        var newPath = `./logs/old/${logstamp}/${file}`;

        fs.rename(oldPath, newPath, function (err) {
            if (err) throw err
            consolelog('Successfully moved old logs');
        });
    });
});

// log for errors
let error = async function (text) {
    date = new Date();
    timestamp = (`${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().padStart(4, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`)
    text = "[" + timestamp + "] " + text + "\n";
    try {
        if (fs.existsSync(errorLogFile)) {
            fs.appendFile(errorLogFile, text, function (err) {
                if (err) throw err;
            });
        } else {
            let stream = fs.createWriteStream(errorLogFile);
            stream.once('open', function (fd) {
                stream.write(text + "\n");
                stream.end();
            });
        };
    } catch (err) {
        console.error(err);
    };
};

// log all to file and show it in the console
let consolelog = async function (text) {
    date = new Date();
    timestamp = (`${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().padStart(4, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`)
    text = "[" + timestamp + "] " + text + "\n";
    console.log(text);
    try {
        if (fs.existsSync(consoleLogFile)) {
            fs.appendFile(consoleLogFile, text, function (err) {
                if (err) throw err;
            });
        } else {
            let stream = fs.createWriteStream(consoleLogFile);
            stream.once('open', function (fd) {
                stream.write(text + "\n");
                stream.end();
            });
        };
    } catch (err) {
        error(err);
    };
};

// log for keyword
let keyword = async function (text) {
    date = new Date();
    timestamp = (`${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().padStart(4, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`)
    text = "[" + timestamp + "] " + text + "\n";
    try {
        if (fs.existsSync(keywordLogFile)) {
            fs.appendFile(keywordLogFile, text, function (err) {
                if (err) throw err;
            });
        } else {
            let stream = fs.createWriteStream(keywordLogFile);
            stream.once('open', function (fd) {
                stream.write(text + "\n");
                stream.end();
            });
        };
    } catch (err) {
        consolelog.error(err);
    };
};

// console.log(`file: ${debugLogFile}\ntext: ${text}`);

// export the functions
module.exports = {
    error: error,
    console: consolelog,
    keyword: keyword
};