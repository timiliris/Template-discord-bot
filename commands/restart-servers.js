const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// Predefined list of servers with their respective IDs and IP addresses
const serverList = {
    'tower-defence': {
        name: 'Tower Defence',
        id: '524df92f', // Replace with actual server ID
        address: '170.205.24.187:25573' // Replace with actual server address
    },
    'battle-royal': {
        name: 'Battle Royal',
        id: '31ddc6f9', // Replace with actual server ID
        address: '170.205.24.187:25570' // Replace with actual server address
    },
    'prominence-2':{
        name: 'Prominence 2',
        id: 'a1840501',
        address: '170.205.24.187:25580'
    }
};

async function restartServer(serverId, apiKey) {
    try {
        const response = await axios.post(`https://panel.midguardnetwork.net/api/client/servers/${serverId}/power`, {
            signal: 'restart',
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error restarting server:', error);
        throw error; // Re-throw to handle later
    }
}

async function getServerStatus(serverAddress) {
    try {
        const response = await axios.get(`https://api.mcsrvstat.us/3/${serverAddress}`);
        const data = response.data;

        return {
            online: data.online,
            version: data.version,
            players: {
                online: data.players.online,
                max: data.players.max,
                list: data.players.list
            },
            mods: data.mods,
            motd: data.motd,
            error: data.error || 'No additional information available.'
        };
    } catch (error) {
        console.error('Error fetching server status:', error);
        return {
            online: false,
            error: 'Error fetching server status.'
        };
    }
}

async function pollServerStatus(serverAddress, interval = 5000, maxAttempts = 12) {
    let attempts = 0;

    while (attempts < maxAttempts) {
        const status = await getServerStatus(serverAddress);
        console.log(`Current status of ${serverAddress}:`, status);

        if (status.online) {
            return status; // Server is online
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, interval)); // Wait for the specified interval
    }

    return null; // Timeout or still offline
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart-server')
        .setDescription('Restart a specified server')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The server to restart')
                .setRequired(true)
                .addChoices(
                    { name: 'Tower Defence', value: 'tower-defence' },
                    { name: 'Battle Royal', value: 'battle-royal' },
                    // Add more servers as needed
                )),

    async execute(interaction) {
        const selectedServer = interaction.options.getString('server');
        const server = serverList[selectedServer];

        if (!server) {
            await interaction.reply({ content: 'Invalid server selection.', ephemeral: true });
            return;
        }

        try {
            await interaction.deferReply();

            const apiKey = process.env.PTERODACTYL_API_KEY;

            // Restart the server
            await restartServer(server.id, apiKey);

            const embed = new EmbedBuilder()
                .setTitle('Server Restarted')
                .setDescription(`The server **${server.name}** is being restarted.`)
                .setColor('#00FF00')
                .setTimestamp()
                .setFooter({ text: 'Restart initiated by ' + interaction.user.username });

            await interaction.followUp({ embeds: [embed] });

            // Poll for server status
            const status = await pollServerStatus(server.address);

            const finalStatusEmbed = new EmbedBuilder()
                .setTitle('Server Status')
                .setDescription(status && status.online
                    ? `The server **${server.name}** is now online with ${status.players.online}/${status.players.max} players.`
                    : `The server **${server.name}** could not be restarted or is still offline.`)
                .setColor(status && status.online ? '#00FF00' : '#FF0000')
                .setTimestamp()
                .setFooter({ text: 'Status check completed by ' + interaction.user.username });

            await interaction.followUp({ embeds: [finalStatusEmbed] });
        } catch (error) {
            console.error('Error in command execution:', error);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('There was an error restarting the server.')
                .setColor('#FF0000')
                .setTimestamp()
                .setFooter({ text: 'Error check initiated by ' + interaction.user.username });

            await interaction.followUp({ embeds: [errorEmbed] });
        }
    },
};
