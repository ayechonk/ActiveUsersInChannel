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
			let absenteeRole = this.client.guilds.first().roles.find( r => r.name === "absentees");
			let mapOfButtSniffers = this.client.guilds.first().roles.find(r => r.name === "buttsniffer").members;
			let arrOfButtSniffers = [];
			let arrOfButtSniffersIds = [];
			for (let [key, guildMember] of mapOfButtSniffers) {
				let useThisName = guildMember.nickname === null?guildMember.user.username:guildMember.nickname;
				arrOfButtSniffers.push(useThisName);
				arrOfButtSniffersIds.push(key);
				// guildMember.addRole(absenteeRole).then(gm => console.log(absenteeRole.name + " has been added to " + useThisName));
			}
			console.log(JSON.stringify(arrOfButtSniffers));
			console.log(JSON.stringify(arrOfButtSniffersIds));
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