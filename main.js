// https://discordapp.com/oauth2/authorize?client_id=705628681300738119&permissions=11328&scope=bot

// require modules and this shit
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

// load logging
const log = require('./handler/logging.js');
const keyword = require('./keyword.js');
const update = require('./util/update.js');

const k = require('./keyword.js');

// load bot config.json file and parse data
let cfgData = fs.readFileSync('./config.json');
let botData = JSON.parse(cfgData);

// set the prefixes for the console logging
let botprefix = '\x1b[93m[BOT]\x1b[0m';

// if bot is ready (started and connected)
client.on('ready', () => {
    log.console(`${botprefix} Verbunden als ${client.user.tag}`);

    update.check(client);
    setInterval(() => {
        update.check(client);
    }, 300000);

    client.user.setActivity(`$help | Servers: ${client.guilds.cache.size}`).catch(log.error);
});

client.on('message', msg => {
    if (!msg.guild || msg.author.bot) return;
    keyword.handle(client, msg, msg.guild.id);
});

// Events und Commands aus den Ordnern "events" und "commands" laden
fs.readdir('./events/', (err, files) => {
    if (err) return log.error(err);
    let jsfile = files.filter(f => f.split('.').pop() === 'js');
    if (jsfile.length <= 0) {
        return log.console(`${botprefix} Keine Events vorhanden!`);
    }
    jsfile.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir('./commands/', (err, files) => {
    if (err) log.error(err);
    let jsfile = files.filter(f => f.split('.').pop() === 'js');
    log.console(`${botprefix} commands: ${jsfile}`);
    if (jsfile.length <= 0) {
        return log.console(`${botprefix} Keine commands vorhanden!`);
    }
    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        client.commands.set(pull.config.name, pull);
        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name);
        });
    });
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Error loggen
process.on('uncaughtException', error => log.console(error));

// login in den bot
client.login(botData.token);
