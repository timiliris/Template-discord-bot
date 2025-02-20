const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restricted')
        .setDescription('Command that requires specific permissions to execute'),
    async execute(interaction) {
        // Vérifier si l'utilisateur a la permission d'administrer le serveur
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ Vous n\'avez pas la permission d\'exécuter cette commande.',
                ephemeral: true
            });
        }

        // Si l'utilisateur a la permission, exécuter la commande
        await interaction.reply('✅ Vous avez les permissions nécessaires pour exécuter cette commande.');
    },
};
