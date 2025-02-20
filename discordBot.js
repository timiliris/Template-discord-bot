const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const sequelize = require('./config/database');
const User = require('./models/User');

const { Client, GatewayIntentBits, Events, ActivityType, Collection } = require('discord.js');

// Ensure correct intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Ensure correct intent usage
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Liste des langues supportées
const supportedLanguages = ['en', 'fr']; // Ajoutez toutes les langues que vous supportez

// Fonction pour charger les messages avec gestion des erreurs
function loadMessages(language) {
    try {
        const rawData = fs.readFileSync(path.join(__dirname, `./lang/${language}.json`));
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error loading language file for ${language}:`, error);
        return loadMessages('en'); // Return default language if error occurs
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    // Récupérer ou créer l'utilisateur
    let user = await User.findOne({ where: { discordId: interaction.user.id } });
    if (!user) {
        user = await User.create({ discordId: interaction.user.id });
    }

    // Mettre à jour le compteur de messages
    user.messageCount += 1;
    await user.save();

    const userLanguage = user.language || 'en';
    const messages = loadMessages(userLanguage) || loadMessages('en');

    try {
        await command.execute(interaction, messages, user, userLanguage);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: messages.cmd_error, ephemeral: true });
    }
});


client.once(Events.ClientReady, async () => {
    console.log(`Connected as ${client.user.tag}`);

    // Synchroniser les modèles avec la base de données
    await sequelize.sync();

    // Définir le statut du bot
    client.user.setPresence({
        activities: [
            {
                name: 'Dev a cool Bot',
                type: ActivityType.Playing,
            }
        ],
        status: 'online'
    });
});

client.login(process.env.BOT_TOKEN);
