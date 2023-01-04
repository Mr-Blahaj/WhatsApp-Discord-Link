/* 
Please Read README.md Before Use!!!!!!!!
*/

const Discord = require('discord.js');
const WhatsApp = require('whatsapp-web.js');
const fs = require('fs')
const config = require('./config.json');

const DiscordClient = new Discord.Client({intents: 33281}); // Discord Client
const WhatsAppClient = new WhatsApp.Client({authStrategy: new WhatsApp.LocalAuth()}); // WhatsApp Client

DiscordClient.login(config.token);
WhatsAppClient.initialize();

const eventFiles = fs.readdirSync(`./events/`).filter(file => file.endsWith(".js"))

eventFiles.forEach(file=>{
  const event = require(`./events/${file}`);
  if(event.type === "discord"){
    DiscordClient.on(event.name, (...args) => event.execute(DiscordClient, WhatsAppClient, ...args));
  } else {
    WhatsAppClient.on(event.name, (...args) => event.execute(DiscordClient, ...args));
  }
});

process.on('uncaughtException', async (e) => { // catch errors
  console.log(e);
  DiscordClient.channels.cache.get(config.LogChannel).send({embeds: [{color: 39423, description: `\`\`\`js\n${e}\`\`\``}]});
});