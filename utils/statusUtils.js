const axios = require('axios');

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

function getStatusText(status) {
    try {
        return `
✅ Server is **online** ! ✅\n
⚡ Version: **${status.version}** ⚡ \n
🎮 Players online: **${status.players.online}/${status.players.max}** 🎮 \n`;
    } catch (error) {
        console.error('Error generating status text:', error);
        return 'Error generating status text.';
    }
}


async function getUUID(username) {
    try {
        const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        return response.data.id;
    } catch (error) {
        console.error('Error fetching UUID:', error.message);
        return null;
    }
}

async function getSkin(username) {
    try {
        const userUuid = await getUUID(username);
        if (userUuid) {
            return `https://crafatar.craftbucks.com/renders/body/${userUuid}`;
        } else {
            return 'Could not fetch the UUID for the given username.';
        }
    } catch (error) {
        console.error('Error fetching skin:', error.message);
        return 'An error occurred while fetching the skin.';
    }
}

module.exports = {
    getServerStatus,
    getStatusText,
    getUUID,
    getSkin
};
