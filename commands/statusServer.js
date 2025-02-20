const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getServerStatus } = require('../utils/getServerStatus');
const { getStatusText } = require('../utils/statusUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mc-status')
        .setDescription('Get the status of a Minecraft server')
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('The IP address of the server')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('port')
                .setDescription('The port of the server')
                .setRequired(false)),

    async execute(interaction) {
        const ip = interaction.options.getString('ip');
        const port = interaction.options.getInteger('port');

        // Construct the server address based on the presence of port
        let serverAddress = ip;
        if (port) {
            serverAddress = `${ip}:${port}`;
        }

        try {
            const status = await getServerStatus(serverAddress);

            // Create the embed object using EmbedBuilder
            const embed = new EmbedBuilder()
                .setTitle(serverAddress)
                .setTimestamp()
                .setFooter({ text: 'Status check initiated by ' + interaction.user.username })

            if (status.online) {
                const statusText = getStatusText(status, serverAddress);

                embed.setDescription(`**Status:** Online\n${statusText}`)
                    .setColor('#00FF00')// Green color for online status
            } else {
                embed.setDescription(`**Status:** Offline\n${status.error}`)
                    .setColor('#FF0000'); // Red color for offline status
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in command execution:', error);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Error fetching server status.')
                .setColor('#FF0000') // Red color for error
                .setTimestamp()
                .setFooter({ text: 'Error check initiated by ' + interaction.user.username })

            await interaction.reply({ embeds: [errorEmbed] });
        }
    },
};
