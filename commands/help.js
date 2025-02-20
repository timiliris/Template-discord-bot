const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getUserMessages = require("../utils/getUserMessages");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of commands.'),
    async execute(interaction) {
        const messages = await getUserMessages(interaction);
        let trad = messages.messages.help;
        // Créer l'objet embed en utilisant EmbedBuilder
        const embed = new EmbedBuilder()
            .setTitle(`📜 ${trad.list_of_commands} 📜`)
            .setColor(process.env.EMBDED_COLOR) // Couleur orange pour l'embed
            .setTimestamp()
            .setFooter({ text: trad.if_you_have_any_questions, iconURL: process.env.LOGO })
            .setThumbnail(process.env.LOGO);

        // Ajouter des champs pour chaque commande
        embed.addFields(
            { name: '🔧 /cmd', value: trad.cmd, inline: false },
            { name: '🔗 /invite', value: trad.get_discord_link, inline: false },
            { name: '🎮 /game', value: trad.game, inline: false },
            { name: '❓ /help', value: trad.help, inline: false }
        );

        // Envoyer le message embed
        await interaction.reply({ embeds: [embed] });
    },
};
