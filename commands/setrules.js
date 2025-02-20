const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrules')
        .setDescription('Enregistrer ou mettre à jour les règles du serveur')
        .addStringOption(option =>
            option.setName('rules')
                .setDescription('Les règles du serveur à enregistrer')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Vérifier si l'utilisateur a la permission d'administrer le serveur
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: '❌ Vous n\'avez pas la permission d\'exécuter cette commande.',
                ephemeral: true
            });
        }

        // Obtenir les règles de l'option
        const rules = interaction.options.getString('rules');

        // Chemin du fichier JSON pour les règles
        const rulesFilePath = path.join(__dirname, '../data/rules.json');

        // Enregistrer les règles dans le fichier
        fs.writeFileSync(rulesFilePath, JSON.stringify({ rules }, null, 2), 'utf-8');

        await interaction.reply('✅ Les règles ont été enregistrées avec succès.');
    },
};
