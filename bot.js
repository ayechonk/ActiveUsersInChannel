require('dotenv').config();
let differenceInDays = require('date-fns/difference_in_days/index.js');

module.exports = function(client) {
	/*VARIABLES*/
	this.client = client;
	this.roster = new Map();
	this.nky = client.guilds.find(g=>g.id === process.env.GUILD_ID);
	this.absenteeRole = this.client.guilds.first().roles.find( r => r.name === "absentees");

	/*EVENTS*/
	this.client.on('voiceStateUpdate', (oldMember, newMember) => {
		this.updateRoster(newMember.user.id);
	});
	this.client.on('message', msg => {
		if (!msg.author.bot) {
			this.consumeMessage(msg);
		}
	});

	/*TIMERS*/
	setInterval(() => {
		this.runRoster()
	}, 30000);

	/*METHODS*/
	this.clearRoster = () => {
		this.roster.clear();
		for (let [key, guildMember] of this.nky.members) {
			guildMember
			.removeRole(this.absenteeRole)
			.then(gm => console.log(this.absenteeRole.name + " has been removed from " + gm.user.username))
			.catch(e=> console.log(e));
		}
	};
	this.consumeMessage = (msg) => {
		if (msg.content === 'clear') {
			this.clearRoster();
			msg.reply('Users have been cleared');
		}
		else if (msg.content === 'roster') {
			let arr = [];
			for (let [key, lastActivityDate] of this.roster) {
				let guildMember = this.nky.members.get(key);
				if (typeof guildMember !== 'undefined') {
					arr.push({name: guildMember.user.username, date: lastActivityDate});
				}
			}
			msg.reply(JSON.stringify(arr));
		}
		else {
			this.updateRoster(msg.author.id);
		}
	};
	this.runRoster = () => {
		console.log('run roster');
		for (let [key, guildMember] of this.nky.members) {
			if (guildMember.user.bot) {
				continue;
			}
			let addRole = false;
			let lastActivity = this.roster.get(guildMember.id);
			if ((typeof lastActivity === 'undefined' || differenceInDays(Date.now(), lastActivity) >= 60) && typeof guildMember.roles.get(this.absenteeRole.id) === 'undefined') {
				addRole = true;
			}
			if (addRole) {
				guildMember.addRole(this.absenteeRole)
				.then(gm => console.log(this.absenteeRole.name + " has been added to " + gm.user.username))
				.catch(e => console.log(e));
			}
		}
	};
	this.seedRoster = () => {
		for (let [key, guildMember] of this.nky.members) {
			if (guildMember.user.bot) {
				continue;
			}
			this.roster.set(guildMember.id, Date.now());
		}
		console.log(this.roster);
	};
	this.updateRoster = id => {
		this.roster.set(id, Date.now());
		this.nky.members.get(id)
		.removeRole(this.absenteeRole)
		.then(gm => console.log(this.absenteeRole.name + " has been removed from " + gm.user.username));
	};

};