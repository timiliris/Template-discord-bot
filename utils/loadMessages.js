const fs = require('fs');
const path = require('path');

// Function to load messages from a language file
function loadMessages(language) {
    try {
        const rawData = fs.readFileSync(path.join(__dirname, `../lang/${language}.json`));
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error loading language file for ${language}:`, error);
        return loadMessages('en'); // Default to English if there's an error
    }
}

// Export the function for use in other files
module.exports = loadMessages;
