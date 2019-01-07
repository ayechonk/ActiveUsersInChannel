require('dotenv').config();
let Bot = require('./bot.js');
let Discord = require('discord.js');

let client = new Discord.Client();

client.login(process.env.BOT_TOKEN).then(() => {
	let bot;
	bot = new Bot(client);
	bot.runRoster();
	console.log('connected successfully');
});