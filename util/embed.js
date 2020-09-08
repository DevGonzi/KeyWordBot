const log = require('../handler/logging.js');
const Discord = require("discord.js");

let sendEmbed = async function (client, channelId, author, color, title, fields, footer, sendAvatar) {
    client = client;
    channelId = channelId;
    color = color;
    title = title;
    if(!author) {
        author = {
            tag: "System#0000",
            id: "742776149545058356",
            avatar: "e16d922bb48ec84895b8363755f8e7d2"
        };
    } else {
        author = author;
    };
    fields = fields;
    footer = footer;
    sendAvatar = sendAvatar;

    if (!channelId) {
        channelId = "742806348395184209";
    }

    let channel = client.channels.cache.get(channelId);

    // console.log(channel)

    if (!channel) {
        channel = client.channels.cache.get("742806348395184209")
    };

    if (!channel) return console.log("CHANNEL UNDEFINED!")

    if (sendAvatar === true) {
        const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setAuthor(author.tag, `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=1024`)
        .addFields(fields)
        .setTimestamp()
        .setFooter(footer)
    channel.send(embed);
    } else {
        const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setAuthor(author.tag)
        .addFields(fields)
        .setTimestamp()
        .setFooter(footer)
    channel.send(embed);
    };
};


// export the functions
module.exports = {
    send: sendEmbed
};