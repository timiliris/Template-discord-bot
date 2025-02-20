const axios = require('axios');

async function getUUID(username) {
    try {
        const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        return response.data.id;
    } catch (error) {
        console.error('Error fetching UUID:', error.message);
        return null;
    }
}

module.exports = { getUUID };
