const User = require("../models/User");
const loadMessages = require("./loadMessages");

async function getUserMessages(interaction) {
    const userId = interaction.user.id;
    let user = await User.findOne({ where: { discordId: userId } });
    if (!user) {
        // Create a new user if not found
        user = await User.create({ discordId: userId, language: 'en' }); // Default to English if no preference
    }
    const userLanguage = user.language;
    // Load messages based on user language
    return {
        language: userLanguage,
        messages: await loadMessages(userLanguage),
    };
}
module.exports = getUserMessages;