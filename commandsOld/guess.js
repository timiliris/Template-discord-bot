const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Start a guessing game.'),
    async execute(interaction) {
        if (interaction.commandName === 'guess') {
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            await interaction.reply('Je pense à un nombre entre 1 et 10. Essayez de deviner ! Répondez avec un nombre entre 1 et 10.');

            let attempts = 0;
            const maxAttempts = 3;
            let guessedCorrectly = false;

            const filter = response => {
                return !isNaN(response.content) && response.content > 0 && response.content <= 10;
            };

            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 }); // 30 seconds for each attempt

            collector.on('collect', async response => {
                const userGuess = parseInt(response.content, 10);

                if (userGuess === randomNumber) {
                    await interaction.followUp('Félicitations ! Vous avez deviné le nombre ! 🎉');
                    guessedCorrectly = true;
                    collector.stop();
                } else {
                    attempts++;
                    if (attempts < maxAttempts) {
                        await interaction.followUp(`Mauvaise réponse. Il vous reste ${maxAttempts - attempts} tentatives. Essayez encore !`);
                    } else {
                        collector.stop();
                    }
                }
            });

            collector.on('end', async (collected, reason) => {
                if (!guessedCorrectly) {
                    await interaction.followUp(`Désolé, le nombre était ${randomNumber}. Bonne chance la prochaine fois !`);
                }
            });
        }
    },
};
