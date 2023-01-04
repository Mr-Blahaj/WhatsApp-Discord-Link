module.exports = {
    name: "message_revoke_everyone",
    type: "whatsapp",
    async execute(DiscordClient, message, revoked_msg) {
        const config = require('../config.json')
        const DefaultAvatar = 'https://i.ibb.co/KjssTPM/image-2023-01-02-211044093.png';
        const contact = await message.getContact();
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
    }
}