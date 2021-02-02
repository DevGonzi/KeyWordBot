const Discord = require('discord.js');
const os = require('os');
const util = require('./../util/util.js');

module.exports.run = async (client, msg, args) => {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle('Bot Stats')
        .setColor('#000000')
        .addFields(
            {
                name: '🌐 Servers',
                value: `Serving ${client.guilds.cache.size} servers.`,
                inline: false,
            },
            {
                name: '📺 Channels',
                value: `Serving ${client.channels.cache.size} channels.`,
                inline: false,
            },
            {
                name: '👥 Server Users',
                value: `Serving ${client.users.cache.size} Users`,
                inline: false,
            },
            {
                name: '⏳ Ping',
                value: `${Math.round(client.ws.ping)}ms`,
                inline: false,
            },
            {
                name: 'Server Info',
                value: `Cores: ${os.cpus().length}`,
                inline: false,
            }
        )
        .setFooter(`Created By: ${msg.author.tag}`, msg.author.displayAvatarURL());

    msg.channel.send(embed);
    if (msg) util.delmsg(msg, 1500);
};

module.exports.config = {
    name: 'botinfo',
    aliases: [],
};
