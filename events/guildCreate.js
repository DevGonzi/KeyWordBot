const Discord = require('discord.js');
const config = require('../config.json');
const log = require('../handler/logging.js');

module.exports = async (client, guild) => {
    // guild commands
    console.log('Joined a new guild: ' + guild.name);

    client.user.setActivity(`$help | Servers: ${client.guilds.cache.size}`).catch(log.error);

    let sendGuild = client.guilds.cache.get('661287017161949216');

    if (guild) {
        channel = sendGuild.channels.cache.get('800189097339125812');
        if (channel) {
            const itemaddmsg = new Discord.MessageEmbed()
                .setColor('#11ff00')
                .setTitle('Bot **joined**!')
                .addField(`Server name: `, `${guild.name}`, true)
                .addField(`Server ID: `, `${guild.id}`, true)
                .addField(`Member: `, `${guild.memberCount}`, true)
                .addField(`Server Owner`, client.users.cache.get(guild.ownerID), true)
                .addField(`Server Owner ID: `, `${guild.ownerID}`, true)
                .setTimestamp()
                .setFooter(`Thanks for using me!`);
            channel.send(itemaddmsg);
        } else {
            console.log("There's no channel with that ID.");
        }
    }
};
