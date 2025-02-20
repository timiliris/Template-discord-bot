const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getUserMessages = require("../utils/getUserMessages");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guessnumber')
        .setDescription('Play the "Guess the Number" game'),
    async execute(interaction) {
        const messages = await getUserMessages(interaction);
        let trad = messages.messages.guessNumber;

        // Define the range for the random number
        const minNumber = 1;
        const maxNumber = 100;
        const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
        const maxAttempts = 10;
        let attempts = 0;
        let gameEnded = false;

        // Create the initial embed message
        const embed = new EmbedBuilder()
            .setTitle(trad.title)
            .setDescription(`${trad.im_thinking_of} **${minNumber}** ${trad.and} **${maxNumber}**.\n\n**${trad.you_have} ${maxAttempts} ${trad.attempts_to_guess}**`)
            .setColor(process.env.EMBED_COLOR || '#0099ff')
            .setTimestamp();

        // Send the initial embed message
        await interaction.reply({ embeds: [embed], fetchReply: true }).then(() => {
            // Create a filter for responses
            const filter = response => !isNaN(response.content) && response.content >= minNumber && response.content <= maxNumber;

            // Create a message collector
            const collector = interaction.channel.createMessageCollector({ filter, time: 300000 }); // 5 minutes

            collector.on('collect', response => {
                if (gameEnded) return;

                const guess = parseInt(response.content, 10);
                attempts++;

                if (guess === randomNumber) {
                    gameEnded = true;
                    collector.stop('win');
                } else if (attempts >= maxAttempts) {
                    gameEnded = true;
                    collector.stop('lose');
                } else {
                    const hint = guess < randomNumber ? trad.too_low : trad.too_high;
                    response.reply(`${hint} ${trad.you_have} **${maxAttempts - attempts}** ${trad.attempts_left}`);
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'win') {
                    interaction.followUp(`${trad.congrats} **${randomNumber}** ${trad.in} **${attempts}** ${trad.attempts}`);
                } else if (reason === 'lose') {
                    interaction.followUp(`${trad.sorry_you_have_used_all_of_your_attempts} **${randomNumber}**. ${trad.better_luck_next_time}`);
                } else {
                    interaction.followUp(`${trad.times_up_the_number_was} **${randomNumber}**. ${trad.thanks_for_playing}`);
                }
            });
        });
    },
};
