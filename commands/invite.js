const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
require('dotenv').config(); // Ensure environment variables are loaded
const getUserMessages = require('../utils/getUserMessages'); // Import your getUserMessages function

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Provides the invitation link to the Discord server'),
    async execute(interaction) {
        // Load messages based on user language
        const message = await getUserMessages(interaction);
        const messages = message.messages

        // Create the invitation button
        const inviteButton = new ButtonBuilder()
            .setLabel(messages.invite.get_discord_link)
            .setStyle(ButtonStyle.Link)
            .setURL(process.env.DISCORD_INVITE_URL);

        // Create the copy button (non-functional, for instruction)
        const copyButton = new ButtonBuilder()
            .setLabel(messages.invite.copy_discord_link)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('copy_link');

        // Create an action row and add buttons
        const row = new ActionRowBuilder()
            .addComponents(inviteButton, copyButton);

        // Send the message with the invitation button and the copy button
        await interaction.reply({
            content: messages.invite.click_to_get_discord_link,
            components: [row]
        });

        // Create a collector to handle interactions with the "Copy Link" button
        const filter = i => i.customId === 'copy_link' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            // Inform the user to copy the link manually
            await i.reply({
                content: `${messages.invite.the_link_is} \`${process.env.DISCORD_INVITE_URL}\`. ${messages.invite.please_copy_manually}`,
                ephemeral: true
            });
        });
    },
};
