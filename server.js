require('dotenv').config();
const Discord = require('discord.js')
const client = new Discord.Client()
const roster = []


const getMemberFromRoster = memberId => {
	var currentMember = null;
	const numOfAttended = roster.length
	for (var i = 0; i < numOfAttended; i++) {
		const currentRosterMember = roster[i]
		if (currentRosterMember.id === memberId) {
			currentMember = currentRosterMember
			break;
		}
	}
	return currentMember
}

const updateToRoster = member => {
	if (member !== null) {
		member.lastAttendance = Date.now()
	}
}

const pushToRoster = memberId => {
	roster.push({
		"id": memberId,
		"lastAttendance": Date.now()
	})
}

client.on('voiceStateUpdate', (oldMember, newMember) => {
	if (newMember.voiceChannelID !== null) {
		const member = getMemberFromRoster(newMember.user.id)
		if (member === null) {
			pushToRoster(newMember.user.id)
		} else {
			updateToRoster(member)
		}
	}
})

client.on('message', msg => {
	if (msg.author.id !== client.user.id) {
		if (msg.content === 'clear') {
			roster = [];
			msg.reply('Users have been cleared')
		} else if (msg.content === 'roster') {
			const usersString = JSON.stringify(roster)
			msg.reply(usersString)
		} else {
			const member = getMemberFromRoster(client.user.id)
			if (member === null) {
				pushToRoster(msg.author.id)
			} else {
				updateToRoster(member)
			}
			console.log(JSON.stringify(roster))
		}
	}
})

client.login(process.env.BOT_TOKEN)