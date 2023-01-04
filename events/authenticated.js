module.exports = {
    name: "authenticated",
    async execute(DiscordClient, data) {
        const config = require('../config.json')
        DiscordClient.channels.cache.get(config.LogChannel).send({embeds: [{color: 39423, description: `WhatsApp Authenticated!`}]});
    }
}