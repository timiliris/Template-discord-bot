module.exports = {
    name: 'farewell',
    description: 'Send a farewell message',
    async execute(message, args, messages, user) {
        message.channel.send(messages.farewell);
        user.points += 10;
        await user.save();
    },
};
