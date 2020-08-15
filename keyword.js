const Discord = require('discord.js');

const fs = require('fs');
const pool = require('./database');
const log = require('./logging')


let handle = async function (client, msg, guildId) {

	// add keyword [10*]
	if (msg.content.startsWith('$+')) {
		if (!msg.member.roles.find(role => role.hasPermission('ADMINISTRATOR')) || !msg.member.roles.find(role => role.hasPermission('MANAGE_MESSAGES'))) return;
		let newkeyword = msg.content.substr(2);
		if (!newkeyword) return msg.channel.send("Error: Syntax: $+Keyword;Description");
		let data = newkeyword.split(';');
		if (!data) return msg.channel.send("Error: Syntax: $+Keyword;Description");
		let name = data[0];
		if (!name) return msg.channel.send("Error: Syntax: $+Keyword;Description");
		let beschreibung = data[1];
		if (!beschreibung) return msg.channel.send("Error: Syntax: $+Keyword;Description");

		pool.query(`INSERT INTO keyworddb(keyword, beschreibung, eingetragen, guildId) VALUES('${name}', '${beschreibung}', '${msg.author.tag}', '${guildId}')`, function (err, res, fields) {
			const itemaddmsg = new Discord.RichEmbed()
				.setColor('#11ff00')
				.setTitle('Keyword **added**!')
				.addField(`Keyword: `, `${name}`)
				.addField(`Description: `, `${beschreibung}`)
				.setTimestamp()
				.setFooter(`Keyword requested from ${msg.author.tag}`);
			msg.channel.send(itemaddmsg);
			if (err) {
				log.error(err);
				msg.channel.send("An error occurred while adding the keyword, please contact <@321373026488811520>!");
			};
			// log who is add keywords
			log.info(`${name} added by ${msg.author.tag} | userId: ${msg.author.id}`);
			pool.query(`INSERT INTO log (keyword, task, discordtag, discordid) VALUES ("${name}", "add", "${msg.author.tag}", "${msg.author.id}");`, function (err, res, fields) {
				if (err) {
					log.error(err);
				}
			});
		})
		// msg.react(`✅`);
		msg.delete(2500);
		// remove command [20*]
	} else if (msg.content.startsWith('$-')) {
		if (!msg.member.roles.find(role => role.hasPermission('ADMINISTRATOR')) || !msg.member.roles.find(role => role.hasPermission('MANAGE_MESSAGES'))) return;
		let newkeyword = msg.content.substr(2);
		let data = newkeyword.split(';');
		let name = data[0];

		if (!newkeyword) return msg.channel.send("Error: Syntax: $-Keyword");
		if (!data) return msg.channel.send("Error: Syntax: $-Keyword");
		if (!name) return msg.channel.send("Error: Syntax: $-Keyword");

		pool.query(`DELETE FROM keyworddb WHERE keyworddb.keyword = "${name}"`, function (err, res, fields) {
			const itemaddmsg = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setTitle('Keyword **deleted**!')
				.addField(`Keyword: `, `${name}`)
				.setTimestamp()
				.setFooter(`Keyword requested from ${msg.author.tag}`);
			msg.channel.send(itemaddmsg);
			if (err) {
				log.error(err);
				msg.channel.send("An error occurred while delete the keyword, please contact <@321373026488811520>!");

			}
			// log who is deleting keywords
			log.info(`${name} removed by ${msg.author.tag} | userId: ${msg.author.id}`);
			pool.query(`INSERT INTO log (keyword, task, discordtag, discordid) VALUES ("${name}", "delete", "${msg.author.tag}", "${msg.author.id}");`, function (err, res, fields) {
				if (err) {
					log.error(err);
				}
			});
		})
		// msg.react(`✅`);
		msg.delete(2500);
	} else if (msg.content.startsWith('$~')) {
		if (!msg.member.roles.find(role => role.hasPermission('ADMINISTRATOR')) || !msg.member.roles.find(role => role.hasPermission('MANAGE_MESSAGES'))) return;
		let newkeyword = msg.content.substr(2);
		let data = newkeyword.split(';');
		let keywordname = data[0];
		let beschreibung = data[1];

		if (!newkeyword) return msg.channel.send("Du solltest schon etwas angeben!");
		if (!data) return msg.channel.send("Error: missing data");
		if (!keywordname) return msg.channel.send("Fehler 303");
		if (!beschreibung) return msg.channel.send("Fehler 304");

		pool.query(`UPDATE keyworddb SET keyworddb.beschreibung = "${beschreibung}" WHERE keyword = "${keywordname}" and guildId = ?`, (guildId), function (err, res, fields) {
			const itemaddmsg = new Discord.RichEmbed()
				.setColor('#ffe100')
				.setTitle('Keyword **changed**!')
				.addField(`Keyword: `, `${keywordname}`)
				.setTimestamp()
				.setFooter(`Keyword requested from ${msg.author.tag}`);
			msg.channel.send(itemaddmsg);
			if (err) {
				log.error(err);
				msg.channel.send("Es ist ein Fehler beim ändern des Keywords aufgetreten, bitte wende dich an <@321373026488811520>!");
				// return msg.react(`❌`);
				return msg.delete(2500);
			}
			// log who is changeing keywords
			log.info(`${keywordname} changed by ${msg.author.tag} | userId: ${msg.author.id}`);
			pool.query(`INSERT INTO log (keyword, task, discordtag, discordid) VALUES (\"${keywordname}\", \"change\", \"${msg.author.tag}\", \"${msg.author.id}\");`, function (err, res, fields) {
				if (err) {
					log.error(err);
					// return msg.react(`❌`);
					return msg.delete(2500);
				}
			});
		})
		// msg.react(`✅`);
		msg.delete(2500);
		// help command
	} else if (msg.content.startsWith('$bothelp')) {
		if (!msg.member.roles.find(role => role.hasPermission('ADMINISTRATOR')) || !msg.member.roles.find(role => role.hasPermission('MANAGE_MESSAGES'))) return;
		const itemaddmsg = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setTitle('KeyWordBot Commands:')
			.addField(`$KEYWORD`, `Queries the keyword from the database and displays it with description.`)
			.addField(`$list`, `List all Keywords.`)
			.addField(`$+Keyword;Description`, `Erstellt das Keyword.`)
			.addField(`$~Keyword;Description`, `CHANGES the description of the Keyword.`)
			.addField(`$-Keyword`, `**Deletes** the Keyword.`)
			.setTimestamp()
			.setFooter(`Keyword requested from ${msg.author.tag}`);
		msg.channel.send(itemaddmsg);
		// msg.react(`✅`);
		msg.delete(2500);
		// list command
	} else if (msg.content.startsWith('$list')) {
		if (!msg.member.roles.find(role => role.hasPermission('ADMINISTRATOR')) || !msg.member.roles.find(role => role.hasPermission('MANAGE_MESSAGES'))) return;
		let m = msg.content.split(' ');
		pool.query('SELECT keyword FROM keyworddb WHERE guildId = ?', (guildId), function (err, res, fields) {
			let keywordlist = [];
			let count = 0;
			res.forEach((res) => {
				count++;
				if (count >= 1) {
					keywordlist.push("\n" + res.keyword)
				} else {
					keywordlist.push(res.keyword)
				}
			});
			if (err) {
				log.error(err);
				msg.channel.send('Fehler!');
				// msg.react(`❌`);
				msg.delete(2500);
			} else {
				if (res.length <= 0) {
					msg.channel.send('Die Liste ist Leer!');
				} else {
					const itemaddmsg = new Discord.RichEmbed()
						.setColor('#0099ff')
						.setTitle('KeyWord-list:')
						.setDescription("Type `$KEYWORD` to show the information.")
						.addField(`Keywords: `, `${keywordlist}`)
						.setTimestamp()
						.setFooter(`Keyword requested from ${msg.author.tag}`);
					msg.channel.send(itemaddmsg);
				}
			};
		});
		// extlist command
	} else if (msg.content.startsWith('$extlist')) {
		if (!msg.member.roles.find(role => role.hasPermission('ADMINISTRATOR')) || !msg.member.roles.find(role => role.hasPermission('MANAGE_MESSAGES'))) return;
		let m = msg.content.split(' ');
		pool.query('SELECT * FROM keyworddb WHERE guildId = ?', (guildId), function (err, res, fields) {
			let keywordlist = [];
			let count = 0;
			res.forEach((res) => {
				count++;
				if (count >= 1) {
					keywordlist.push("\n" + res.keyword + " **|** " + res.usecount)
				} else {
					keywordlist.push(res.keyword + " **|** " + res.usecount)
				}
			});
			if (err) {
				log.error(err);
				msg.channel.send('Fehler!');
				// msg.react(`❌`);
				msg.delete(2500);
			} else {
				if (res.length <= 0) {
					msg.channel.send('The list is empty!');
				} else {
					const itemaddmsg = new Discord.RichEmbed()
						.setColor('#0099ff')
						.setTitle('Extended KeyWordlist:')
						.setDescription('Function to see how often the keywords are used')
						.addField(`Keywords **|** Count used`, `${keywordlist}`)
						.setTimestamp()
						.setFooter(`Keyword requested from ${msg.author.tag}`);
					msg.channel.send(itemaddmsg);
				}
			};
		});
	} else if (msg.content.startsWith('$')) {
		if (!msg.member.roles.find(role => role.hasPermission('ADMINISTRATOR')) || !msg.member.roles.find(role => role.hasPermission('MANAGE_MESSAGES'))) return;
		let msglow = msg.content.toLowerCase();
		let keyword = msglow.substr(1);

		console.log("test")
		pool.query('SELECT * FROM keyworddb WHERE keyword = ? AND guildId = ? ORDER BY keyworddb.id DESC', [keyword, guildId], function (err, res, fields) {

			// log.info(res[0])
			if (res[0]) {
				log.keyword(`Keyword "${keyword}" requested by ${msg.author.tag}! \ndb res: ${res[0].keyword}`);
			} else {
				log.keyword(`Keyword "${keyword}" requested by ${msg.author.tag}! \nNOT found in DB!`);
			};


			if (res[0]) {
				let keywordfromdb = res[0].keyword;
				let text = res[0].beschreibung;
				const itemaddmsg = new Discord.RichEmbed()
					.setColor('#0099ff')
					.setTitle('Information:')
					.addField(`Keyword: `, `${keywordfromdb}`)
					.addField(`Beschreibung: `, `${text}`)
					.setTimestamp()
					.setFooter(`Keyword requested from ${msg.author.tag}`);
				msg.channel.send(itemaddmsg);
				// msg.react(`✅`);
				msg.delete(2500);
				pool.query(`UPDATE keyworddb SET keyworddb.usecount = usecount+1 WHERE keyword = "${keywordfromdb}"`, function (err, res, fields) {
					if (err) {
						// msg.react(`❌`);
						msg.delete(2500);
						log.info("err while updating usecount")
						log.error(err);
					}
				});
			} else {
				pool.query('SELECT * FROM keyworddb WHERE alias = ? ORDER BY keyworddb.id DESC', (keyword), function (err, res, fields) {
					if (res[0]) {
						let keywordfromdb = res[0].keyword;
						let text = res[0].beschreibung;
						const itemaddmsg = new Discord.RichEmbed()
							.setColor('#0099ff')
							.setTitle('Information:')
							.addField(`Keyword: `, `${keywordfromdb}`)
							.addField(`Beschreibung: `, `${text}`)
							.setTimestamp()
							.setFooter(`Keyword requested from ${msg.author.tag}`);
						msg.channel.send(itemaddmsg);
						// msg.react(`✅`);
						msg.delete(2500);
						pool.query(`UPDATE keyworddb SET keyworddb.usecount = usecount+1 WHERE keyword = "${keywordfromdb}"`, function (err, res, fields) {
							if (err) {
								// msg.react(`❌`);
								msg.delete(2500);
								log.info("err while updating usecount")
								log.error(err);
							}
						});
					} else {
						const itemaddmsg = new Discord.RichEmbed()
							.setColor('#ff0000')
							.setTitle('Keyword **NICHT** Gefunden!')
							.addField(`Keyword: `, `${keyword}`)
							.setTimestamp()
							.setFooter(`Keyword requested from ${msg.author.tag}`);
						msg.channel.send(itemaddmsg);
						// msg.react(`❌`);
						msg.delete(2500);
					}
				})


			};
		});
	};
};


// export the functions
module.exports = {
	handle: handle
};