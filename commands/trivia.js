const axios = require('axios');
const User = require('../models/User');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const getUserMessages = require('../utils/getUserMessages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Start a trivia game in your preferred language'),
    async execute(interaction) {
        // Load messages based on user language
        const messages = await getUserMessages(interaction);
        let trad = messages.messages.trivia;

        try {
            const response = await axios.get(`https://api.openquizzdb.org/?key=UT7CNC754P&lang=${messages.language}&type=trivia&choice=4&diff=1&anec=1&wiki=1`);
            const questionData = response.data.results[0];
            if (!questionData) {
                return interaction.reply({ content: trad.no_questions, ephemeral: true });
            }

            const question = questionData.question;
            const correctAnswer = questionData.reponse_correcte;
            const incorrectAnswers = questionData.autres_choix || [];

            // Create a unique list of answers
            const answers = new Set(incorrectAnswers);
            answers.add(correctAnswer);

            // Shuffle answers
            const shuffledAnswers = Array.from(answers).sort(() => Math.random() - 0.5);

            const answerOptions = shuffledAnswers.map((answer, index) => `${index + 1}. ${answer}`).join('\n');

            // Create an embed for the trivia question
            const embed = new EmbedBuilder()
                .setTitle('🎉 Trivia Game 🎉')
                .setDescription(`${question}\n\n${answerOptions}`)
                .setColor(process.env.EMBDED_COLOR)
                .setTimestamp();

            // Send the trivia question
            await interaction.reply({ embeds: [embed] });

            // Create buttons for users to select an answer
            const row = new ActionRowBuilder();
            shuffledAnswers.forEach((answer, index) => {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`trivia_${index}`)
                        .setLabel(`${index + 1}`)
                        .setStyle(ButtonStyle.Primary)
                );
            });

            const triviaMessage = await interaction.followUp({ content: trad.select_answer, components: [row] });

            // Create a filter for button interactions
            const filter = i => i.user.id === interaction.user.id && i.customId.startsWith('trivia_');
            const collector = triviaMessage.createMessageComponentCollector({ filter, time: 30000 });

            collector.on('collect', async i => {
                const userChoice = parseInt(i.customId.split('_')[1]);
                const responder = i.user;

                const resultMessage = shuffledAnswers[userChoice] === correctAnswer
                    ? `${trad.congrats} ${responder} ! \n\n ${trad.good_answer} 🎉`
                    : `${trad.bad_answer} ! \n\n  ${trad.the_good_answer} **${correctAnswer}**.`;
                let extraInfo = '';
                if (shuffledAnswers[userChoice] === correctAnswer) {
                    // Update user points
                    let user = await User.findOne({ where: { discordId: responder.id } });
                    if (!user) {
                        user = await User.create({ discordId: responder.id });
                    }

                    // Add points to user
                    user.points += 10;
                    await user.save();

                    // Announce points won and current points
                    extraInfo += `\n\n${trad.have_win_x_points} ${user.points} ${trad.points}.`;
                }

                if (questionData.anecdote) {
                    extraInfo += `\n\n**${trad.little_story}** ${questionData.anecdote}`;
                }
                if (questionData.wikipedia) {
                    extraInfo += `\n\n**${trad.discover_more}** [${trad.click_on_the_wiki_link}](${questionData.wikipedia})`;
                }

                await i.update({ content: resultMessage + extraInfo, components: [] });
                collector.stop();
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    interaction.followUp(`⏳ ${trad.times_up} ${trad.the_good_answer} **${correctAnswer}**. ${trad.thank_you} 🎉`);
                }
            });

        } catch (error) {
            console.error(`${trad.error_while_fetching} :`, error);
            interaction.reply({ content: `${trad.error_while_fetching} ${trad.try_later}`, ephemeral: true });
        }
    },
};



