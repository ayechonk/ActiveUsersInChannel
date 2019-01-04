require('dotenv').config();
let Bot = require('./bot.js');
let Discord = require('discord.js');

let bot;
let client = new Discord.Client();

client.on('voiceStateUpdate', (oldMember, newMember) => {
	if (newMember.voiceChannelID !== null) {
		let member = getMemberFromRoster(newMember.user.id);
		if (member === null) {
			bot.pushToRoster(newMember.user.id)
		} else {
			bot.updateToRoster(member)
		}
	}
});

client.on('message', msg => {
	if (msg.author.id !== client.user.id) {
		bot.consumeMessage(msg);
	}
});

client.login(process.env.BOT_TOKEN).then(() => {
	bot = new Bot(client);
	console.log('connected successfully');
});