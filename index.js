/* 
Please Read README.md Before Use!!!!!!!!
*/

const Discord = require('discord.js');
const WhatsApp = require('whatsapp-web.js');
const fs = require('fs');

const token = 'YourBotToken'; // Insert Your Discord Bot Token Here
const guild_id = '1059775549221912666'; // Insert Your Guild ID Here

let config = require('./config.json'); // DO NOT TOUCH THIS FILE

const DefaultAvatar = 'https://i.ibb.co/KjssTPM/image-2023-01-02-211044093.png';

const DiscordClient = new Discord.Client({intents: 33281}); // Discord Client
const WhatsAppClient = new WhatsApp.Client({authStrategy: new WhatsApp.LocalAuth()}); // WhatsApp Client
let webhookClient;

DiscordClient.login(token); // Discord Login

DiscordClient.once('ready', async () => {
  if (!config.LogChannel) {
    // <------ Saving and creating Channels ------>
    config['LogChannel'] = (await DiscordClient.guilds.cache.get(guild_id).channels.create({name: '🪵-logs', type: 0})).id;
    config['ForumChannel'] = (await DiscordClient.guilds.cache.get(guild_id).channels.create({name: '💬-chats', type: 15})).id;
    config['DeletedMessagesChannel'] = (await DiscordClient.guilds.cache.get(guild_id).channels.create({name: '🗑-deleted-messages', type: 0})).id;

    // <------ Saving and creating webhook ------>
    let webhook = await DiscordClient.channels.cache.get(config.ForumChannel).createWebhook({name: 'WhatsApp',avatar: `https://cdn-icons-png.flaticon.com/512/124/124034.png`});
    config['WebhookID'] = webhook.id;
    config['WebhookToken'] = webhook.token;

    // <------ Writing to config.json ------>
    fs.writeFile('./config.json',JSON.stringify(config, null, 2),function writeJSON(err) {if (err) return console.log(err)});
  }

  webhookClient = new Discord.WebhookClient({id: config.WebhookID,token: config.WebhookToken});
  log(`Logged in as ${DiscordClient.user.tag}`);
  WhatsAppClient.initialize(); // initializing whatsapp
});

DiscordClient.on('messageCreate', async (message) => {
  let info = DiscordClient.channels.cache.get(config.ForumChannel).threads.cache.get(message.channelId);
  if (!message.webhookId && info) { // if the message is not sent by webhook and is in thread
    let id = await DiscordClient.channels.cache.get(config.ForumChannel).threads.cache.get(message.channelId).fetchStarterMessage(); // getting the first message of the thread which contains the ID
    WhatsAppClient.sendMessage(id.content, message.content); // sending the whatsapp message
  }
});

WhatsAppClient.on('authenticated', () => {
  log(`WhatsApp Authenticated!`);
});

WhatsAppClient.on('qr', async (qr) => { // When not logged in
  require('qrcode-terminal').generate(qr, {small: true}, function (string) {log(`**WhatsApp Authentication Failed! Please Scan this!**`+'```'+string +'```');});
});

WhatsAppClient.on('message_create', async (message) => {
  const contact = await message.getContact(); // getting contact info
  let chat = await message.getChat(); // getting chat info
  let thread = DiscordClient.channels.cache.get(config.ForumChannel).threads.cache.find((x) => x.name === `${chat.name}`);
  if (chat.id._serialized != 'status@broadcast') {
    if (!thread) { // if the thread is not already made
      thread = await webhookClient.send({
        content: `${chat.id._serialized}`,
        username: `WhatsApp`,
        avatarURL: `https://cdn-icons-png.flaticon.com/512/124/124034.png`,
        threadName: chat.name,
      });
    }
    webhookClient.send({
      content: message.body,
      username: `${contact.name ?? contact.pushname}`,
      avatarURL: `${(await contact.getProfilePicUrl()) ?? DefaultAvatar}`,
      threadId: thread.id,
    });
  }
});

WhatsAppClient.on('message_revoke_everyone', async (message, revoked_msg) => {
  const contact = await message.getContact(); // getting contact info
  DiscordClient.channels.cache.get(config.DeletedMessagesChannel).send({
      embeds: [
        {
          color: 39423,
          author: {
            name: `Message Sent by ${contact.name ?? contact.pushname}`,
            icon_url: `${(await contact.getProfilePicUrl()) ?? DefaultAvatar}`,
          },
          description: `${revoked_msg.body}`,
          footer: {
            text: `${(await message.getChat()).name} || ID: ${message.from}`,
          },
        },
      ],
    });
});

process.on('uncaughtException', async (e) => { // catch errors
  console.log(e);
  log('```js' + `\n${e}` + '```');
});

async function log(data) { // log function
  DiscordClient.channels.cache.get(config.LogChannel).send({embeds: [{color: 39423, description: data}]});
}