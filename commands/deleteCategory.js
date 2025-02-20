const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletecategory')
        .setDescription('Supprime une catégorie avec tous ses canaux.')
        .addStringOption(option =>
            option.setName('category_id')
                .setDescription('ID de la catégorie à supprimer.')
                .setRequired(true)),
    async execute(interaction) {
        const categoryId = interaction.options.getString('category_id');
        const guild = interaction.guild;

        try {
            // Trouver la catégorie
            const category = guild.channels.cache.get(categoryId);

            if (!category || category.type !== ChannelType.GuildCategory) {
                return interaction.reply({ content: 'La catégorie spécifiée n\'existe pas ou n\'est pas valide.', ephemeral: true });
            }

            // Récupérer les canaux de la catégorie
            const channels = category.children.cache;

            if (channels.size === 0) {
                // Si aucun canal à supprimer, supprimez simplement la catégorie
                await category.delete('Suppression de la catégorie.');
                return interaction.reply({ content: 'La catégorie a été supprimée avec succès.', ephemeral: true });
            }

            // Supprimer les canaux de la catégorie
            for (const [id, channel] of channels) {
                try {
                    await channel.delete('Suppression du canal dans la catégorie.');
                } catch (error) {
                    console.error(`Erreur lors de la suppression du canal ${channel.id}:`, error);
                }
            }

            // Supprimer la catégorie
            await category.delete('Suppression de la catégorie.');

            // Répondre à l'utilisateur
            await interaction.reply({ content: 'Catégorie et tous ses canaux supprimés avec succès.', ephemeral: true });
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie:', error);
            await interaction.reply({ content: 'Une erreur est survenue lors de la suppression de la catégorie.', ephemeral: true });
        }
    },
};
