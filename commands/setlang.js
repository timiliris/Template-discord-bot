const { SlashCommandBuilder } = require('discord.js');
const User = require('../models/User');
const loadMessage = require('../utils/loadMessages');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlang')
        .setDescription('Define your preferred language')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('the language you want to use.')
                .setRequired(true)
                .addChoices(
                    { name: 'English', value: 'en' },
                    { name: 'Français', value: 'fr' }
                )
        ),
    async execute(interaction) {
        const language = interaction.options.getString('language');

        // Récupérer ou créer l'utilisateur
        let user = await User.findOne({ where: { discordId: interaction.user.id } });
        if (!user) {
            user = await User.create({ discordId: interaction.user.id });
        }

        // Mettre à jour la langue de l'utilisateur
        user.language = language;
        await user.save();
        const userLanguage = user.language;

        // Load messages based on user language
        const messages = await loadMessage(userLanguage);
        await interaction.reply({ content: `${messages.lang.language_set} ${language === 'en' ? 'English' : 'Français'}.`, ephemeral: true });
    },
};