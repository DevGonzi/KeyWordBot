const Discord = require('discord.js');
const client = new Discord.Client();

async function deleteMsg(msg, timeout, reason) {
	if (timeout && reason) {
		msg.delete({
			timeout: timeout,
			reason: reason
		});
	} else if (timeout) {
		msg.delete({
			timeout: timeout
		});
	} else {
		msg.delete();
	};
};

// export the functions
module.exports = {
	delmsg: deleteMsg
};