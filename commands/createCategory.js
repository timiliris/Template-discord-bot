const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createcategory')
        .setDescription('Creates a category with customized channels based on the template.')
        .addStringOption(option =>
            option.setName('custom_name')
                .setDescription('Custom name for the category and channels.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('template')
                .setDescription('Template to use for channel creation.')
                .setRequired(true)
                .addChoices(
                    { name: 'Support', value: 'support' },
                    { name: 'Gaming', value: 'gaming' },
                    { name: 'Mc Server', value: 'mcserver' },
                    { name: 'Welcome', value: 'welcome' },
                    { name: 'Staff Project', value:'staff-project'}
                )),
    async execute(interaction) {
        const customName = interaction.options.getString('custom_name');
        const template = interaction.options.getString('template');
        const guild = interaction.guild;

        let categoryName;
        let channelsToCreate = [];

        // Configure names based on the chosen template
        switch (template) {
            case 'support':
                categoryName = `${customName}`;
                channelsToCreate = [
                    { name: `『📣』Announcements`, type: ChannelType.GuildNews },
                    { name: `『💬』Chat`, type: ChannelType.GuildText, topic: 'Public Support Channel' },
                    { name: `『🎫』Tickets`, type: ChannelType.GuildText, topic: 'React to the message to open a ticket' },
                    { name: `『📝』Wiki`, type: ChannelType.GuildForum, topic: 'Public Support Wiki' },
                    { name: `『🔊』VOC`, type: ChannelType.GuildVoice }
                ];
                break;
            case 'gaming':
                categoryName = `${customName}`;
                channelsToCreate = [
                    { name: `『📣』Announcements`, type: ChannelType.GuildNews },
                    { name: `『💬』Chat`, type: ChannelType.GuildText, topic: `${customName} Text Chat Channel` },
                    { name: `『📸』Share`, type: ChannelType.GuildText, topic: `${customName} Sharing Chat Channel` },
                    { name: `『🗂️』Forum`, type: ChannelType.GuildForum, topic: `${customName} forum` },
                    { name: `『🛋️』Lobby`, type: ChannelType.GuildVoice },
                    { name: `『🔊』VOC`, type: ChannelType.GuildVoice },
                ];
                break;
            case 'welcome':
                categoryName = `${customName}`;
                channelsToCreate = [
                    { name: `『✅』Welcome`, type: ChannelType.GuildText, topic: `${customName} Text Chat Channel` },
                    { name: `『💬』Chat`, type: ChannelType.GuildText, topic: `${customName} Text Chat Channel` },
                    { name: `『🛋️』Lobby`, type: ChannelType.GuildVoice },
                ];
                break;
            case 'mcserver':
                categoryName = `${customName}`;
                channelsToCreate = [
                    { name: `『💬』Chat`, type: ChannelType.GuildText, topic: `${customName} Text Chat Channel` },
                    { name: `『🖥️』Console`, type: ChannelType.GuildText, topic: `${customName} Server Console Channel` },
                    { name: `『📸』Share`, type: ChannelType.GuildText, topic: `${customName} Sharing Chat Channel` },
                    { name: `『🗂️』Forum`, type: ChannelType.GuildForum, topic: `${customName} forum` },
                    { name: `『🔊』VOC`, type: ChannelType.GuildVoice },
                ];
                break;
            case 'staff-project':
                categoryName = `${customName}`;
                channelsToCreate = [
                    { name: `『💬』Chat`, type: ChannelType.GuildText, topic: `${customName} Text Chat Channel` },
                    { name: `『🚀』Update`, type: ChannelType.GuildText, topic: `${customName} Project Update Channel` },
                    { name: `『🤖』Github`, type: ChannelType.GuildText, topic: `${customName} Project Update Channel` },
                    { name: `『🖥️』Console`, type: ChannelType.GuildText, topic: `${customName} Server Console Channel` },
                    { name: `『🔊』VOC`, type: ChannelType.GuildVoice },
                ];
                break;
            default:
                categoryName = `Category-${customName}`;
                channelsToCreate = [
                    { name: `text-${customName}`, type: ChannelType.GuildText },
                    { name: `voice-${customName}`, type: ChannelType.GuildVoice }
                ];
                break;
        }

        try {
            // Create the category
            const category = await guild.channels.create({
                name: categoryName,
                type: ChannelType.GuildCategory,
                reason: 'Creating a new category with channels.',
            });

            // Create channels in the category
            for (const channelInfo of channelsToCreate) {
                await guild.channels.create({
                    name: channelInfo.name,
                    type: channelInfo.type,
                    parent: category.id,
                    topic: channelInfo.topic,
                    reason: `Creating a ${channelInfo.type} channel in the new category.`,
                });
            }

            // Reply to the user
            await interaction.reply({ content: `Category successfully created: ${category.name}\nChannels created: ${channelsToCreate.map(ch => ch.name).join(', ')}`, ephemeral: true });
        } catch (error) {
            console.error('Error creating channels:', error);
            await interaction.reply({ content: 'An error occurred while creating the channels.', ephemeral: true });
        }
    },
};
