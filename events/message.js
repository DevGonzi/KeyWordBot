const Discord = require("discord.js");
const config = require("../config.json");
const log = require('../logging.js');

module.exports = async (client, msg) => {
    // guild commands
    if (!msg.guild || msg.author.bot) return;
    
    const args = msg.content.split(/\s+/g);
	const command = msg.content.startsWith(config.prefix) && args.shift().slice(config.prefix.length).toLowerCase();
	
    if(command){
        let commandfile = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        
        if(commandfile) commandfile.run(client, msg, args);
    };
};
