const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const getUserMessages = require("../utils/getUserMessages");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duel')
        .setDescription('Launch the duel game')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to challenge')
                .setRequired(true)),
    async execute(interaction) {
        const messages = await getUserMessages(interaction);
        let trad = messages.messages.duel || {}; // Ensure trad is an object
        const challenger = interaction.user;
        const target = interaction.options.getUser('user');

        if (target.id === challenger.id) {
            return interaction.reply(trad.cannot_duel_yourself || 'You cannot duel yourself.');
        }

        const duelChannel = interaction.channel;

        // Create embed for the duel challenge
        const embed = new EmbedBuilder()
            .setTitle('⚔️ Duel Challenge ⚔️')
            .setDescription(`${target}, ${trad.challenged_by || 'has challenged'} ${challenger}!`)
            .addFields(
                { name: trad.challenger || 'Challenger', value: `${challenger}`, inline: true },
                { name: trad.challenged || 'Challenged', value: `${target}`, inline: true }
            )
            .setColor(process.env.EMBED_COLOR || '#0099ff')
            .setTimestamp();

        // Send the duel challenge message with buttons
        const confirmationMessage = await duelChannel.send({
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('accept')
                            .setLabel(trad.accept || 'Accept')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('decline')
                            .setLabel(trad.decline || 'Decline')
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });

        // Create a collector for button interactions
        const filter = i => i.user.id === target.id && i.isButton();
        const collector = duelChannel.createMessageComponentCollector({ filter, time: 30000 }); // 30 seconds to respond

        collector.on('collect', async interaction => {
            if (interaction.customId === 'accept') {
                await interaction.update({
                    embeds: [new EmbedBuilder()
                        .setTitle(trad.duel_accepted || 'Duel Accepted')
                        .setDescription(`${target} ${trad.will_start_soon || 'will start soon'}`)
                        .setColor('#00FF00')
                        .setTimestamp()
                    ],
                    components: []
                });

                startCountdown();
            } else if (interaction.customId === 'decline') {
                await interaction.update({
                    embeds: [new EmbedBuilder()
                        .setTitle(trad.duel_declined || 'Duel Declined')
                        .setDescription(`${target} ${trad.declined_maybe_next_time || 'declined. Maybe next time.'}`)
                        .setColor('#FF0000')
                        .setTimestamp()
                    ],
                    components: []
                });
            }

            collector.stop();
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                duelChannel.send(`${trad.time_up || 'Time\'s up!'} ${target} ${trad.did_not_respond || 'did not respond.'}`);
            }
        });

        function startCountdown() {
            const countdown = 5; // Countdown time in seconds
            const duelDuration = 10 * 1000; // Total duel duration in milliseconds (10 seconds)

            duelChannel.send(`${trad.duel_countdown || 'Duel starting in'} ${countdown} ${trad.seconds_get_ready || 'seconds. Get ready!'}`);

            for (let i = countdown; i > 0; i--) {
                setTimeout(() => duelChannel.send(`${i}...`), (countdown - i) * 1000);
            }

            setTimeout(() => {
                duelChannel.send(trad.go_shoot || 'Go! Shoot!');

                const filter = response => {
                    return response.content.toLowerCase() === (trad.shoot_word || 'shoot') &&
                        (response.author.id === challenger.id || response.author.id === target.id);
                };
                const messageCollector = duelChannel.createMessageCollector({ filter, time: duelDuration });

                messageCollector.on('collect', response => {
                    const winner = response.author;
                    messageCollector.stop('win');
                    duelChannel.send(`${trad.congrats || 'Congratulations'} ${winner} ${trad.won_against || 'won against'} ${(winner.id === challenger.id ? target : challenger)}`);
                });

                messageCollector.on('end', (collected, reason) => {
                    if (reason === 'win') return;
                    duelChannel.send(`${trad.time_up_no_one_won || 'Time\'s up! No one won the duel.'} ${challenger} ${target}`);
                });

            }, countdown * 1000);
        }
    },
};
