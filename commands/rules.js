const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Afficher les règles du serveur'),
    async execute(interaction) {
        // Chemin du fichier JSON pour les règles
        const rulesFilePath = path.join(__dirname, '../data/rules.json');

        if (!fs.existsSync(rulesFilePath)) {
            return interaction.reply('🚫 Les règles n\'ont pas encore été définies.');
        }

        // Lire les règles depuis le fichier
        const rulesData = JSON.parse(fs.readFileSync(rulesFilePath, 'utf-8'));

        await interaction.reply({
            content: `📜 **Règles du serveur**:\n\n${rulesData.rules}`,
        });
    },
};
