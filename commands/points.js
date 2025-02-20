const { SlashCommandBuilder } = require('discord.js');
const User = require('../models/User'); // Import the User model
const getUserMessages = require('../utils/getUserMessages'); // Import your getUserMessages function

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Check your current points'),
    async execute(interaction) {
        // Load messages based on user language
        const messages = await getUserMessages(interaction);

        try {
            // Retrieve or create the user
            let user = await User.findOne({ where: { discordId: interaction.user.id } });
            if (!user) {
                // Create a new user if not found
                user = await User.create({ discordId: interaction.user.id });
            }

            // Display the number of points
            await interaction.reply(`💰 You have ${user.points} points.`);
        } catch (error) {
            console.error('Error fetching user points:', error);
            await interaction.reply({ content: messages.cmd_error, ephemeral: true });
        }
    },
};
