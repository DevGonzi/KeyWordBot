const Discord = require("discord.js");

const fs = require("fs");
const pool = require("./handler/database.js");
const log = require("./handler/logging.js");
const util = require("./util/util.js");

const idGonzi = "321373026488811520";

let handle = async function (client, msg, guildId) {
  // add keyword [10*]
  if (msg.content.startsWith("$+")) {
    if (
      msg.member.roles.cache.find((role) =>
        role.permissions.has("ADMINISTRATOR")
      ) ||
      msg.member.roles.cache.find((role) =>
        role.permissions.has("MANAGE_MESSAGES")
      ) ||
      msg.author.id === idGonzi
    ) {
      let newkeyword = msg.content.substr(2);
      if (!newkeyword)
        return msg.channel.send("Error: Syntax: $+Keyword;Description");
      let data = newkeyword.split(";");
      if (!data)
        return msg.channel.send("Error: Syntax: $+Keyword;Description");
      let name = data[0];
      if (!name)
        return msg.channel.send("Error: Syntax: $+Keyword;Description");
      let beschreibung = data[1];
      if (!beschreibung)
        return msg.channel.send("Error: Syntax: $+Keyword;Description");

      pool.query(
        `INSERT INTO keyworddb(keyword, beschreibung, eingetragen, guildId) VALUES('${name}', '${beschreibung}', '${msg.author.tag}', '${guildId}')`,
        function (err, res, fields) {
          const itemaddmsg = new Discord.MessageEmbed()
            .setColor("#11ff00")
            .setTitle("Keyword **added**!")
            .addField(`Keyword: `, `${name}`)
            .addField(`Description: `, `${beschreibung}`)
            .setTimestamp()
            .setFooter(`Keyword requested from ${msg.author.tag}`);
          msg.channel.send(itemaddmsg);
          if (err) {
            log.error(err);
            msg.channel.send(
              "An error occurred while adding the keyword, please contact <@321373026488811520>!"
            );
          }
          // log who is add keywords
          log.console(
            `${name} added by ${msg.author.tag} | userId: ${msg.author.id}`
          );
          pool.query(
            `INSERT INTO log (keyword, task, discordtag, discordid) VALUES ("${name}", "add", "${msg.author.tag}", "${msg.author.id}");`,
            function (err, res, fields) {
              if (err) {
                log.error(err);
              }
            }
          );
        }
      );
      util.delmsg(msg, 2500);
    }
  } else if (msg.content.startsWith("$-")) {
    if (
      msg.member.roles.cache.find((role) =>
        role.permissions.has("ADMINISTRATOR")
      ) ||
      msg.member.roles.cache.find((role) =>
        role.permissions.has("MANAGE_MESSAGES")
      ) ||
      msg.author.id === idGonzi
    ) {
      let newkeyword = msg.content.substr(2);
      let data = newkeyword.split(";");
      let name = data[0];

      if (!newkeyword) return msg.channel.send("Error: Syntax: $-Keyword");
      if (!data) return msg.channel.send("Error: Syntax: $-Keyword");
      if (!name) return msg.channel.send("Error: Syntax: $-Keyword");

      pool.query(
        `DELETE FROM keyworddb WHERE keyworddb.keyword = "${name}"and guildId = ? AND keyworddb.isGlobal = "0"`,
        guildId,
        function (err, res, fields) {
          const itemaddmsg = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Keyword **deleted**!")
            .addField(`Keyword: `, `${name}`)
            .setTimestamp()
            .setFooter(`Keyword requested from ${msg.author.tag}`);
          msg.channel.send(itemaddmsg);
          if (err) {
            log.error(err);
            msg.channel.send(
              "An error occurred while delete the keyword, please contact <@321373026488811520>!"
            );
          }
          // log who is deleting keywords
          log.console(
            `${name} removed by ${msg.author.tag} | userId: ${msg.author.id}`
          );
          pool.query(
            `INSERT INTO log (keyword, task, discordtag, discordid) VALUES ("${name}", "delete", "${msg.author.tag}", "${msg.author.id}");`,
            function (err, res, fields) {
              if (err) {
                log.error(err);
              }
            }
          );
        }
      );
      util.delmsg(msg, 2500);
    }
  } else if (msg.content.startsWith("$~")) {
    if (
      msg.member.roles.cache.find((role) =>
        role.permissions.has("ADMINISTRATOR")
      ) ||
      msg.member.roles.cache.find((role) =>
        role.permissions.has("MANAGE_MESSAGES")
      ) ||
      msg.author.id === idGonzi
    ) {
      let newkeyword = msg.content.substr(2);
      let data = newkeyword.split(";");
      let keywordname = data[0];
      let beschreibung = data[1];

      if (!newkeyword)
        return msg.channel.send("Error: Syntax: $+Keyword;Description");
      if (!data)
        return msg.channel.send("Error: Syntax: $+Keyword;Description");
      if (!keywordname)
        return msg.channel.send(
          "Error: keyword name missing! \nSyntax: $+Keyword;Description"
        );
      if (!beschreibung)
        return msg.channel.send(
          "Error: Description missing! \nSyntax: $+Keyword;Description"
        );

      pool.query(
        `UPDATE keyworddb SET keyworddb.beschreibung = "${beschreibung}" WHERE keyword = "${keywordname}" AND guildId = ? AND isGlobal = "0" `,
        guildId,
        function (err, res, fields) {
          const itemaddmsg = new Discord.MessageEmbed()
            .setColor("#ffe100")
            .setTitle("Keyword **changed**!")
            .addField(`Keyword: `, `${keywordname}`)
            .setTimestamp()
            .setFooter(`Keyword change requested from ${msg.author.tag}`);
          msg.channel.send(itemaddmsg);
          if (err) {
            log.error(err);
            msg.channel.send(
              "An error occurred while change the keyword, please contact <@321373026488811520>!"
            );

            // return msg.react(`❌`);
            return util.delmsg(msg, 2500);
          }
          // log who is changeing keywords
          log.console(
            `${keywordname} changed by ${msg.author.tag} | userId: ${msg.author.id}`
          );
          pool.query(
            `INSERT INTO log (keyword, task, discordtag, discordid) VALUES (\"${keywordname}\", \"change\", \"${msg.author.tag}\", \"${msg.author.id}\");`,
            function (err, res, fields) {
              if (err) {
                log.error(err);
                // return msg.react(`❌`);
                return util.delmsg(msg, 2500);
              }
            }
          );
        }
      );
      util.delmsg(msg, 2500);
    }
    // help command
  } else if (
    msg.content.startsWith("$bothelp") ||
    msg.content.startsWith("$help")
  ) {
    // if (msg.member.roles.cache.find(role => role.permissions.has('ADMINISTRATOR')) || msg.member.roles.cache.find(role => role.permissions.has('MANAGE_MESSAGES')) || msg.author.id === idGonzi) {
    const itemaddmsg = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("KeyWordBot Commands:")
      .addField(
        `$KEYWORD`,
        `Queries the keyword from the database and displays it with description.`
      )
      .addField(`$list`, `List all Keywords.`)
      .addField(`$+Keyword;Description`, `Creates a new Keyword.`)
      .addField(
        `$~Keyword;Description`,
        `CHANGES the description of the Keyword.`
      )
      .addField(`$-Keyword`, `**Deletes** the Keyword.`)
      .setTimestamp()
      .setFooter(`bothelp requested from ${msg.author.tag}`);
    msg.channel.send(itemaddmsg);
    util.delmsg(msg, 2500);
    // };
    // list command
  } else if (msg.content.startsWith("$list")) {
    if (
      msg.member.roles.cache.find((role) =>
        role.permissions.has("ADMINISTRATOR")
      ) ||
      msg.member.roles.cache.find((role) =>
        role.permissions.has("MANAGE_MESSAGES")
      ) ||
      msg.author.id === idGonzi
    ) {
      let m = msg.content.split(" ");
      pool.query(
        "SELECT keyword FROM keyworddb WHERE guildId = ?",
        guildId,
        function (err, res, fields) {
          let keywordlist = [];
          let count = 0;
          if (!res) return log.error("!res", JSON.stringify(res));
          res.forEach((res) => {
            count++;
            if (count >= 1) {
              keywordlist.push("\n" + res.keyword);
            } else {
              keywordlist.push(res.keyword);
            }
          });
          if (err) {
            log.error(err);
            msg.channel.send("Error!");
            // msg.react(`❌`);
            util.delmsg(msg, 2500);
          } else {
            if (res.length <= 0) {
              msg.channel.send("The list is empty!");
            } else {
              const itemaddmsg = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("KeyWord-list:")
                .setDescription("Type `$KEYWORD` to show the information.")
                .addField(`Keywords: `, `${keywordlist}`)
                .setTimestamp()
                .setFooter(`Keyword list requested from ${msg.author.tag}`);
              msg.channel.send(itemaddmsg);
            }
          }
        }
      );
    }
    // extlist command
  } else if (msg.content.startsWith("$extlist")) {
    if (
      msg.member.roles.cache.find((role) =>
        role.permissions.has("ADMINISTRATOR")
      ) ||
      msg.member.roles.cache.find((role) =>
        role.permissions.has("MANAGE_MESSAGES")
      ) ||
      msg.author.id === idGonzi
    ) {
      let m = msg.content.split(" ");
      // console.log(m[1])
      pool.query(
        "SELECT * FROM keyworddb WHERE guildId = ?",
        guildId,
        function (err, res, fields) {
          console.log(res.length);
          if (res.length >= 25) {
            console.log("bigger then 25");
          }

          let keywordlist = [];
          let count = 0;
          res.forEach((res) => {
            count++;
            if (count >= 1) {
              keywordlist.push("\n" + res.keyword + " **|** " + res.usecount);
              if (count >= 25)
                keywordlist2.push(
                  "\n" + res.keyword + " **|** " + res.usecount
                );
              else if (count >= 50)
                keywordlist2.push(
                  "\n" + res.keyword + " **|** " + res.usecount
                );
              else if (count >= 75)
                keywordlist3.push(
                  "\n" + res.keyword + " **|** " + res.usecount
                );
              else if (count >= 100)
                keywordlist3.push(
                  "\n" + res.keyword + " **|** " + res.usecount
                );
            } else {
              keywordlist.push(res.keyword + " **|** " + res.usecount);
            }
          });
          if (err) {
            log.error(err);
            msg.channel.send("Error!");
            // msg.react(`❌`);
            util.delmsg(msg, 2500);
          } else {
            if (res.length <= 0) {
              msg.channel.send("The list is empty!");
            } else {
              const itemaddmsg = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Extended KeyWordlist:")
                .setDescription(
                  "Function to see how often the keywords are used"
                )
                .addField(`Keywords **|** Count used`, `${keywordlist}`)
                .setTimestamp()
                .setFooter(`extendet list requested from ${msg.author.tag}`);
              msg.channel.send(itemaddmsg);
            }
          }
        }
      );
    }
  } else if (msg.content.startsWith("$")) {
    let msglow = msg.content.toLowerCase();
    let keyword = msglow.substr(1);
    if (keyword.length == 0) return;

    pool.query(
      'SELECT * FROM keyworddb WHERE keyword = ? AND guildId = ? OR keyword = ? AND isGlobal = "1" OR alias = ? AND guildId = ? OR alias = ? AND isGlobal = "1" ORDER BY keyworddb.id DESC',
      [keyword, guildId, keyword, keyword, guildId, keyword],
      function (err, res, fields) {
        if (res[0]) {
          log.keyword(
            `Keyword "${keyword}" requested by ${msg.author.tag}! \ndb res: ${res[0].keyword}`
          );
        } else {
          log.keyword(
            `Keyword "${keyword}" requested by ${msg.author.tag}! \nNOT found in DB!`
          );
          return sendNotFound(keyword, msg, guildId);
        }

        if (res[0]) {
          let keywordfromdb = res[0].keyword;
          let text = res[0].beschreibung;
          const itemaddmsg = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Information:")
            .addField(`Keyword: `, `${keywordfromdb}`)
            .addField(`Description: `, `${text}`)
            .setTimestamp()
            .setFooter(`Keyword requested from ${msg.author.tag}`);
          msg.channel.send(itemaddmsg);
          util.delmsg(msg, 2500);
          pool.query(
            `UPDATE keyworddb SET keyworddb.usecount = usecount+1 WHERE keyword = "${keywordfromdb}"`,
            function (err, res, fields) {
              if (err) {
                msg.react(`❌`);
                // util.delmsg(msg, 2500);
                log.console("err while updating usecount");
                log.error(err);
              }
            }
          );
        }
      }
    );
  }
};

// funktion to send "keyword not found"
function sendNotFound(keyword, msg, guildId) {
  const itemaddmsg = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setTitle("Keyword **not** found!")
    .addField(`Keyword: `, `${keyword}`)
    .setTimestamp()
    .setFooter(`Keyword requested from ${msg.author.tag}`);
  msg.channel.send(itemaddmsg);
  msg.react(`❌`);
  // util.delmsg(msg, 2500);
  return log.console(`No keywords for guild ${guildId} found!`);
}

// export the functions
module.exports = {
  handle: handle,
};
