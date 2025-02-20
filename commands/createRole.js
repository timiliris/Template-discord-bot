const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

const namedColors = {
    'RED': '#FF0000',
    'GREEN': '#00FF00',
    'BLUE': '#0000FF',
    'YELLOW': '#FFFF00',
    'CYAN': '#00FFFF',
    'MAGENTA': '#FF00FF',
    'WHITE': '#FFFFFF',
    'BLACK': '#000000',
    'GRAY': '#808080',
    'ORANGE': '#FFA500',
    'PURPLE': '#800080',
    'PINK': '#FFC0CB',
    // Add more named colors as needed
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createrole')
        .setDescription('Creates a role with specific permissions')
        .addStringOption(option =>
            option.setName('role_name')
                .setDescription('The name of the role to create')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('permissions')
                .setDescription('Comma-separated list of permissions to grant (e.g., "SEND_MESSAGES,READ_MESSAGE_HISTORY")')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('bitmask')
                .setDescription('Direct bitmask value for permissions')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Color of the role in hex code (e.g., #ff0000) or a color name (e.g., BLUE)')
                .setRequired(false)),
    async execute(interaction) {
        const roleName = interaction.options.getString('role_name');
        const permissionsList = interaction.options.getString('permissions');
        const bitmask = interaction.options.getInteger('bitmask');
        const colorInput = interaction.options.getString('color');
        const guild = interaction.guild;

        let permissionsBitmask = BigInt(0); // Initialize with BigInt

        // Validate and set permissions bitmask
        if (bitmask !== null) {
            if (bitmask < 0 || bitmask > (2 ** 32 - 1)) {
                return interaction.reply({ content: 'Invalid bitmask value. It must be a valid integer within the range of Discord permissions.', ephemeral: true });
            }
            permissionsBitmask = BigInt(bitmask);
        } else if (permissionsList) {
            const permissionsMap = {
                'CREATE_INSTANT_INVITE': PermissionsBitField.Flags.CreateInstantInvite,
                'KICK_MEMBERS': PermissionsBitField.Flags.KickMembers,
                'BAN_MEMBERS': PermissionsBitField.Flags.BanMembers,
                'ADMINISTRATOR': PermissionsBitField.Flags.Administrator,
                'MANAGE_CHANNELS': PermissionsBitField.Flags.ManageChannels,
                'MANAGE_GUILD': PermissionsBitField.Flags.ManageGuild,
                'ADD_REACTIONS': PermissionsBitField.Flags.AddReactions,
                'VIEW_AUDIT_LOG': PermissionsBitField.Flags.ViewAuditLog,
                'PRIORITY_SPEAKER': PermissionsBitField.Flags.PrioritySpeaker,
                'STREAM': PermissionsBitField.Flags.Stream,
                'VIEW_CHANNEL': PermissionsBitField.Flags.ViewChannel,
                'SEND_MESSAGES': PermissionsBitField.Flags.SendMessages,
                'SEND_TTS_MESSAGES': PermissionsBitField.Flags.SendTtsMessages,
                'MANAGE_MESSAGES': PermissionsBitField.Flags.ManageMessages,
                'EMBED_LINKS': PermissionsBitField.Flags.EmbedLinks,
                'ATTACH_FILES': PermissionsBitField.Flags.AttachFiles,
                'READ_MESSAGE_HISTORY': PermissionsBitField.Flags.ReadMessageHistory,
                'MENTION_EVERYONE': PermissionsBitField.Flags.MentionEveryone,
                'USE_EXTERNAL_EMOJIS': PermissionsBitField.Flags.UseExternalEmojis,
                'VIEW_GUILD_INSIGHTS': PermissionsBitField.Flags.ViewGuildInsights,
                'CONNECT': PermissionsBitField.Flags.Connect,
                'SPEAK': PermissionsBitField.Flags.Speak,
                'MUTE_MEMBERS': PermissionsBitField.Flags.MuteMembers,
                'DEAFEN_MEMBERS': PermissionsBitField.Flags.DeafenMembers,
                'MOVE_MEMBERS': PermissionsBitField.Flags.MoveMembers,
                'USE_VAD': PermissionsBitField.Flags.UseVAD,
                'CHANGE_NICKNAME': PermissionsBitField.Flags.ChangeNickname,
                'MANAGE_NICKNAMES': PermissionsBitField.Flags.ManageNicknames,
                'MANAGE_ROLES': PermissionsBitField.Flags.ManageRoles,
                'MANAGE_WEBHOOKS': PermissionsBitField.Flags.ManageWebhooks,
                'MANAGE_EMOJIS_AND_STICKERS': PermissionsBitField.Flags.ManageEmojisAndStickers,
                'USE_APPLICATION_COMMANDS': PermissionsBitField.Flags.UseApplicationCommands,
                'REQUEST_TO_SPEAK': PermissionsBitField.Flags.RequestToSpeak,
                'MANAGE_EVENTS': PermissionsBitField.Flags.ManageEvents,
                'MANAGE_THREADS': PermissionsBitField.Flags.ManageThreads,
                'CREATE_PUBLIC_THREADS': PermissionsBitField.Flags.CreatePublicThreads,
                'CREATE_PRIVATE_THREADS': PermissionsBitField.Flags.CreatePrivateThreads,
                'USE_EXTERNAL_STICKERS': PermissionsBitField.Flags.UseExternalStickers,
                'SEND_MESSAGES_IN_THREADS': PermissionsBitField.Flags.SendMessagesInThreads,
                'USE_EMBEDDED_ACTIVITIES': PermissionsBitField.Flags.UseEmbeddedActivities,
                'MODERATE_MEMBERS': PermissionsBitField.Flags.ModerateMembers,
            };

            for (const perm of permissionsList.split(',').map(p => p.trim().toUpperCase())) {
                if (permissionsMap[perm]) {
                    permissionsBitmask |= permissionsMap[perm];
                } else {
                    return interaction.reply({ content: `Invalid permission: ${perm}`, ephemeral: true });
                }
            }
        } else {
            return interaction.reply({ content: 'You must provide either a permissions list or a bitmask value.', ephemeral: true });
        }

        // Convert color input to a valid format
        let roleColor;
        if (colorInput) {
            // Check if colorInput is a named color
            roleColor = namedColors[colorInput.toUpperCase()];
            if (!roleColor) {
                // If not a named color, parse as hex
                const hexColorMatch = /^#([0-9A-Fa-f]{6})$/.exec(colorInput);
                if (hexColorMatch) {
                    roleColor = parseInt(hexColorMatch[1], 16);
                } else {
                    return interaction.reply({ content: 'Invalid color format. Please use a hex code (e.g., #ff0000) or a valid color name.', ephemeral: true });
                }
            } else {
                roleColor = parseInt(roleColor.replace('#', ''), 16);
            }
        } else {
            // Default color if none is provided
            roleColor = 0x0000FF; // Default to blue
        }

        try {
            // Create the role with the calculated or provided permissions bitmask
            const role = await guild.roles.create({
                name: roleName,
                color: roleColor, // Set the role color
                permissions: permissionsBitmask, // Set the permissions bitmask
                reason: 'Role created by command',
            });

            // Reply to the user
            await interaction.reply({ content: `Role "${role.name}" created successfully with permissions bitmask: ${permissionsBitmask} and color: ${colorInput}`, ephemeral: true });
        } catch (error) {
            console.error('Error creating role:', error);
            await interaction.reply({ content: 'An error occurred while creating the role.', ephemeral: true });
        }
    },
};
