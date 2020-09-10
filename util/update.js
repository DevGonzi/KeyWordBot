const { exec } = require("child_process");

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
            let supportGuild = client.guilds.get('744193604787896382');
            outages = supportGuild.channels.get('750255957258272768');
            outages.send("restart due to an update in 5 minutes");

            console.log("Fetched from Git, restart in 5 minutes");
            setTimeout(() => {
                process.exit(0);
            }, 300000);
        } else {
            console.log("Bot is up to date!");
        }
    });
};


// export the functions
module.exports = {
    check: check
};