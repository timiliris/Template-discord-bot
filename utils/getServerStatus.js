const axios = require('axios');

async function getServerStatus(serverAddress) {
    try {
        const response = await axios.get(`https://api.mcsrvstat.us/3/${serverAddress}`);
        const data = response.data;

        return {
            online: data.online,
            version: data.version,
            icon: data.icon || 'https://midguardnetwork.com/storage/img/logo.png',
            players: {
                online: data.players.online,
                max: data.players.max,
                list: data.players.list || []
            },
            mods: data.mods || [],
            plugins: data.plugins || [],
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

module.exports = { getServerStatus };
