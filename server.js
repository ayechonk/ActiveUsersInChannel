require('dotenv').config();

let Bot = require('./bot.js');
let Discord = require('discord.js');
let client = new Discord.Client();
let roster = [];

let getMemberFromRoster = memberId => {
	let currentMember = null;
	let numOfAttended = roster.length;
	for (let i = 0; i < numOfAttended; i++) {
		let currentRosterMember = roster[i];
		if (currentRosterMember.id === memberId) {
			currentMember = currentRosterMember;
			break;
		}
	}
	return currentMember
};

let updateToRoster = member => {
	if (member !== null) {
		member.lastAttendance = Date.now()
	}
};

let pushToRoster = memberId => {
	roster.push({
		"id": memberId,
		"lastAttendance": Date.now()
	})
};

client.on('voiceStateUpdate', (oldMember, newMember) => {
	if (newMember.voiceChannelID !== null) {
		let member = getMemberFromRoster(newMember.user.id);
		if (member === null) {
			pushToRoster(newMember.user.id)
		} else {
			updateToRoster(member)
		}
	}
});

client.on('message', msg => {
	if (msg.author.id !== client.user.id) {
		if (msg.content === 'clear') {
			roster = [];
			msg.reply('Users have been cleared')
		} else if (msg.content === 'roster') {
			let usersString = JSON.stringify(roster);
			msg.reply(usersString)
		} else {
			let member = getMemberFromRoster(client.user.id);
			if (member === null) {
				pushToRoster(msg.author.id)
			} else {
				updateToRoster(member)
			}
			console.log(JSON.stringify(roster))
		}
	}
});

client
.login(process.env.BOT_TOKEN)
.then(
	function () {
		console.log(new Bot());
		console.log('connected successfully');
	});