const  {exec} = require("child_process");
const embed = require('./embed.js');

// fetch();
console.log("Load update manager")

let check = async function (client) {
    exec("cd /home/DiscordBots/KeyWordBot", (error, stdout, stderr) => {
        if (error) {
            return console.log(`error: ${error.message}`);
        }
        if (stderr) {
            return console.log(`stderr: ${stderr}`);
        }
    });
    exec("git pull", (error, stdout, stderr) => {
        if (error) {
            return console.log(`error: ${error.message}`);
        }
        if (stderr) console.log(`stderr: ${stderr}`);

        // console.log(`stdout: ${stdout}`);

        if (!stdout.includes("Already up to date") && !stdout.includes("Bereits aktuell.")) {
            let fields = {
                name: 'Auto Updated on Startup',
                value: 'restart in 5 seconds', 
                inline: false
            };
            embed.send(client, "752904720515072373", undefined, "#00ff3c", "Bot Updated", fields, `AutoUpdated`, true);
            console.log("Fetched from Git, restart in 5 seconds");
            setTimeout(() => {
                process.exit(0);
            }, 5000);
        } else {
            console.log("Bot is up to date!");
        }
    });
};


// export the functions
module.exports = {
    check: check
};