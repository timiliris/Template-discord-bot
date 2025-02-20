const { SlashCommandBuilder } = require('discord.js');
const User = require('../models/User'); // Importer le modèle User
const getUserMessages = require('../utils/getUserMessages'); // Import your getUserMessages function

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the leaderboard of points and message counts'),
    async execute(interaction) {
        // Load messages based on user language
        const messages = await getUserMessages(interaction);
        const trad = messages.messages.leaderboard;

        try {
            // Récupérer tous les utilisateurs et leurs points
            const users = await User.findAll({
                order: [['points', 'DESC']], // Trier par points décroissants
                limit: 10 // Limiter à top 10
            });

            if (users.length === 0) {
                return interaction.reply(trad.no_users_found);
            }

            // Créer le message du leaderboard
            let leaderboardMessage = trad.leaderboard_title + '\n';
            users.forEach((user, index) => {
                leaderboardMessage += `${index + 1}. <@${user.discordId}>: ${user.points} points, ${user.messageCount} messages\n`;
            });

            // Envoyer le message du leaderboard
            await interaction.reply(leaderboardMessage);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            await interaction.reply({ content: trad.cmd_error, ephemeral: true });
        }
    },
};
