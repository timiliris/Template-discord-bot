const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const sharp = require('sharp');
const { getServerStatus, getStatusText } = require("../utils/statusUtils");

// A predefined list of servers with associated badge URLs
const serverList = {
    'prominence': {
        name: 'Prominence II [RPG]',
        badgeUrl: 'https://status.midguardnetwork.com/api/badge/2/status',
        url: 'play.midguardnetwork.com',
        planId: '30c9d726-928f-4daa-b3f8-93b55eeceaf2'
    },
    'survival+':{
        name: 'Survival +',
        badgeUrl: 'https://status.midguardnetwork.com/api/badge/3/status',
        url: 'play.midguardnetwork.net',
        planId: '0d4cb464-f2ef-4c32-a665-1808dbf6a406'
    }
};

async function authenticate(username, password) {
    try {
        const response = await axios.post('https://stats.midguardnetwork.eu/auth/login', `user=${username}&password=${password}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
        });

        const cookies = response.headers['set-cookie'];
        if (cookies) {
            console.log('Logged in successfully:', response.data);
            const authCookie = cookies.find(cookie => cookie.startsWith('auth='));
            return authCookie ? authCookie.split(';')[0] : null;
        } else {
            throw new Error('No cookies found');
        }
    } catch (error) {
        console.error('Error during authentication:', error.response ? error.response.data : error.message);
        throw error;
    }
}
function generate24hStatusText(data) {
    return `
**Last 24 Hours Statistics:**
- **TPS (Ticks Per Second):** ${data.tps_24h}
- **CPU Usage:** ${data.cpu_24h}
- **RAM Usage:** ${data.ram_24h}
- **Current Entities:** ${data.entities_24h}
- **Chunks Processed:** ${data.chunks_24h}
- **Server Downtime:** ${data.server_downtime_24h}
- **Average Downtime:** ${data.avg_server_downtime_24h}
- **Low TPS Spikes:** ${data.low_tps_spikes_24h}
    `;
}

async function getPerformanceOverview(serverIds, cookie) {
    const encodedServers = encodeURIComponent(JSON.stringify(serverIds));

    try {
        const response = await axios.get(`https://stats.midguardnetwork.eu/v1/network/performanceOverview?servers=${encodedServers}`, {
            headers: {
                'Cookie': cookie
            }
        });
        console.log('Performance Overview Data:', response.data.numbers);
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching performance overview:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('services-status')
        .setDescription('Get the status of a predefined service')
        .addStringOption(option =>
            option.setName('service')
                .setDescription('The server to check the status for')
                .setRequired(true)
                .addChoices(
                    { name: 'Prominence II [RPG]', value: 'prominence' },
                    { name: 'Survival +', value: 'survival+' },
                )),

    async execute(interaction) {
        const selectedService = interaction.options.getString('service');
        const server = serverList[selectedService];

        if (!server) {
            await interaction.reply({ content: 'Invalid service selection.', ephemeral: true });
            return;
        }

        try {
            await interaction.deferReply(); // Acknowledge the interaction

            // Fetch server info
            const serverInfo = await getServerStatus(server.url);
            const serverStatus = getStatusText(serverInfo);
            let serverPerformance
            const serverIds = [];
            if (server.planId) {
                serverIds.push(server.planId);
                const username = 'Timiliris420'; // Replace with your actual username
                const password = 'Prokofiev2914!'; // Replace with your actual password
                const cookie = await authenticate(username, password);

                if (!cookie) {
                    throw new Error('Authentication failed: No auth cookie.');
                }

                serverPerformance = await getPerformanceOverview(serverIds, cookie);

                console.log(serverPerformance);
            }

            const response = await axios.get(server.badgeUrl);
            const svgBuffer = Buffer.from(response.data);
            const pngBuffer = await sharp(svgBuffer).png().toBuffer();
            const perfText =  generate24hStatusText(serverPerformance)
            const text = serverStatus + perfText
            const embed = new EmbedBuilder()
                .setTitle(`STATUS`)
                .setAuthor({ name: server.name, iconURL: process.env.LOGO, url: 'https://midguardnetwork.com/' })
                .setDescription(text)
                .setThumbnail('attachment://badge.png')
                .setColor('#00FF00')
                .setTimestamp()
                .setFooter({ text: 'Status check initiated by ' + interaction.user.username });

            await interaction.editReply({
                embeds: [embed],
                files: [{ attachment: pngBuffer, name: 'badge.png' }],
            });
        } catch (error) {
            console.error('Error in command execution:', error);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Error fetching or converting server status.')
                .setColor('#FF0000')
                .setTimestamp()
                .setFooter({ text: 'Error check initiated by ' + interaction.user.username });

            // Reply with a generic error message
            if (!interaction.replied) {
                await interaction.reply({ embeds: [errorEmbed] });
            } else {
                await interaction.followUp({ embeds: [errorEmbed] });
            }
        }
    },
};
