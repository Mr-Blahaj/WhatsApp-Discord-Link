module.exports = {
    name: "ready",
    type: "discord",
    async execute(DiscordClient) {
        const fs = require('fs')
        let config = require('../config.json')
        if (!config.LogChannel) {
            // <------ Saving and creating Channels ------>
            config['LogChannel'] = (await DiscordClient.guilds.cache.get(config.guild_id).channels.create({name: '🪵-logs', type: 0})).id;
            config['ForumChannel'] = (await DiscordClient.guilds.cache.get(config.guild_id).channels.create({name: '💬-chats', type: 15})).id;
            config['DeletedMessagesChannel'] = (await DiscordClient.guilds.cache.get(config.guild_id).channels.create({name: '🗑-deleted-messages', type: 0})).id;
        
            // <------ Saving and creating webhook ------>
            let webhook = await DiscordClient.channels.cache.get(config.ForumChannel).createWebhook({name: 'WhatsApp',avatar: `https://cdn-icons-png.flaticon.com/512/124/124034.png`});
            config['WebhookID'] = webhook.id;
            config['WebhookToken'] = webhook.token;
        
            // <------ Writing to config.json ------>
            fs.writeFile('./config.json',JSON.stringify(config, null, 2),function writeJSON(err) {if (err) return console.log(err)});
        }
        DiscordClient.channels.cache.get(config.LogChannel).send({embeds: [{color: 39423, description: `Logged in as ${DiscordClient.user.tag}`}]});
    }
}