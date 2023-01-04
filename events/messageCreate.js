module.exports = {
    name: "messageCreate",
    type: "discord",
    async execute(DiscordClient, WhatsAppClient, message) {
        const config = require('../config.json')
        let info = DiscordClient.channels.cache.get(config.ForumChannel).threads.cache.get(message.channelId);
        if (!message.webhookId && info) {
            let id = await DiscordClient.channels.cache.get(config.ForumChannel).threads.cache.get(message.channelId).fetchStarterMessage();
            WhatsAppClient.sendMessage(id.content, message.content);
        }
    }
}