const Discord = require("discord.js");
const util = require('./../util/util.js');

module.exports.run = async (client, msg, args) => {
  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
  };

  var time = process.uptime();
  var uptime = (time + "").toHHMMSS();
  var t = uptime.split(':');
  msg.channel.send('Der Bot läuft seit ' + t[0] + ' Stunden, ' + t[1] + ' Minuten und ' + t[2] + ' Sekunden!');
  msg.react(`✅`);
  util.delmsg(msg, 1500);
};

module.exports.config = {
  name: "uptime",
  aliases: [],
};