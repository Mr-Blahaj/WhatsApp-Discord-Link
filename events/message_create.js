module.exports = {
    name: "message_create",
    async execute(DiscordClient, message) {
        const config = require('../config.json')
        const Discord = require('discord.js')
        const DefaultAvatar = 'https://i.ibb.co/KjssTPM/image-2023-01-02-211044093.png';
        const webhookClient = new Discord.WebhookClient({id: config.WebhookID,token: config.WebhookToken});
        const contact = await message.getContact();
        let chat = await message.getChat();
        let thread = DiscordClient.channels.cache.get(config.ForumChannel).threads.cache.find((x) => x.name === `${chat.name}`);
        if (chat.id._serialized != 'status@broadcast') {
            if (!thread) {
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
    }
}