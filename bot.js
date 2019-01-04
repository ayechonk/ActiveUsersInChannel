module.exports = function(){
	this.test = "test";
	this.roster = [];
	this.getMemberFromRoster = memberId => {
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
};