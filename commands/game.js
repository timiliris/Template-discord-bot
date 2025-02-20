const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Show available games with the bot'),
    async execute(interaction) {
        // Create the embed using EmbedBuilder
        const embed = new EmbedBuilder()
            .setTitle('🎮 Available Games 🎮')
            .setColor(process.env.EMBDED_COLOR)
            .setTimestamp()
            .setFooter({ text: 'Enjoy your games!', iconURL: process.env.LOGO }) // Customize footer if desired
            .setThumbnail(process.env.LOGO);

        // Add fields for each game command
        embed.addFields(
            { name: '**🧩 /guess start**', value: 'Start the "Guess the Number" game (0-10).', inline: false },
            { name: '**🔢 /guessnumber**', value: 'Start the "Guess the Number" game (0-100).', inline: false },
            { name: '**🔠 /scramble**', value: 'Start the "Word Scramble" game.', inline: false },
            { name: '**🧠 /trivia**', value: 'Start the "Trivia" game.', inline: false },
            { name: '**⚔️ /duel**', value: 'Start the "Duel" game. Be the first to shoot!', inline: false },
            { name: '**🔤 /guessword**', value: 'Start the "Guess the Word" game.', inline: false },
            { name: '**🚀 More games coming soon!**', value: 'Stay tuned for more exciting games!', inline: false }
        );

        // Reply with the embed
        await interaction.reply({ embeds: [embed] });
    },
};
