const Discord = require('discord.js');
const config = require('../config.json');
const pool = require('../handler/database.js');
const log = require('../handler/logging.js');

module.exports = async (client, guild) => {
    // guild commands

    console.log('Kicked from a guild: ' + guild.name);

    pool.query(`DELETE FROM keyworddb WHERE keyworddb.guildId = ? AND keyworddb.isGlobal = "0"`, guild.id, function (err, res, fields) {
        if (err) {
            log.error(err);
        }
    });

    client.user.setActivity(`$help | Servers: ${client.guilds.cache.size}`).catch(log.error);

    let sendGuild = client.guilds.cache.get('661287017161949216');

    if (guild) {
        channel = sendGuild.channels.cache.get('800189097339125812');
        if (channel) {
            const itemaddmsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Bot **kicked**!')
                .addField(`Server name: `, `${guild.name}`)
                .addField(`Server ID: `, `${guild.id}`)
                .addField(`Server Owner ID: `, `${guild.ownerID}`)
                .addField(`Member: `, `${guild.memberCount}`, true)
                .setTimestamp()
                .setFooter(`Guild Owner ${guild.ownerID}`);
            channel.send(itemaddmsg);
        } else {
            console.log("There's no channel with that ID.");
        }
    }
};
