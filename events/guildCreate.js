const Discord = require("discord.js");
const config = require("../config.json");
const log = require('../handler/logging.js');

module.exports = async (client, guild) => {
    // guild commands
    let guildArray = client.guilds.array();

    console.log("Joined a new guild: " + guild.name);

    client.user.setActivity(`$help | Servers: ${client.guildskeywordbot}`).catch(log.error);


    let sendGuild = client.guilds.get('744193604787896382');

    if (guild) {
        channel = sendGuild.channels.get('752798339686465556');
        if (channel) {

            const itemaddmsg = new Discord.RichEmbed()
                .setColor('#11ff00')
                .setTitle('Bot **joined**!')
                .addField(`Server name: `, `${guild.name}`)
                .addField(`Server ID: `, `${guild.id}`)
                .addField(`Server Owner ID: `, `${guild.ownerID}`)
                .setTimestamp()
                .setFooter(`Thanks for using me!`);
            channel.send(itemaddmsg);
        } else {
            console.log("There's no channel with that ID.");
        };
    };
};
