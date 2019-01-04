module.exports = function(client) {
	this.client = client;
	this.roster = [];

	this.getMemberFromRoster = memberId => {
		let currentMember = null;
		let numOfAttended = this.roster.length;
		for (let i = 0; i < numOfAttended; i++) {
			let loopMember = this.roster[i];
			if (loopMember.id === memberId) {
				currentMember = loopMember;
				break;
			}
		}
		return currentMember;
	};

	this.consumeMessage = (msg) => {
		if (msg.content === 'clear') {
			this.clearRoster();
			msg.reply('Users have been cleared');
		}
		else if (msg.content === 'roster') {
			msg.reply(JSON.stringify(this.roster));
		}
		else if (msg.content === 'roles') {
			// msg.reply(JSON.stringify(this.client.guilds));
			msg.reply(JSON.stringify(this.client.guilds.first().roles.find("name", "buttsniffer").members));
			// let guild = this.client.guilds.first();
			// let mapRoles = guild.roles;
			// for (let [key, role] of mapRoles) {
			// 	console.log(role);
			// }
		}
		else {
			let memberId = msg.author.id;
			let member = this.getMemberFromRoster(memberId);
			if (member === null) {
				this.pushToRoster(memberId)
			}
			else {
				this.updateToRoster(member)
			}
			console.log(JSON.stringify(this.roster))
		}
	};

	this.clearRoster = () => {
		this.roster = [];
	};

	this.pushToRoster = (newUserId) => {
		this.roster.push({
			"id": newUserId,
			"lastAttendance": Date.now()
		})
	};

	this.updateToRoster = member => {
		if (member !== null) {
			member.lastAttendance = Date.now()
		}
	};
};