module.exports = {
    name: "qr",
    type: "whatsapp",
    async execute(DiscordClient, qr) {
        const config = require('../config.json')
        require('qrcode-terminal').generate(qr, {small: true}, function (string) {
            DiscordClient.channels.cache.get(config.LogChannel).send({embeds: [{color: 39423, description: `**WhatsApp Authentication Failed! Please Scan this!**\`\`\`${string}\`\`\``}]});
        })
    }
}
