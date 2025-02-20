module.exports = {
    name: 'greet',
    description: 'Send a greeting message',
    async execute(message, args, messages, user) {
        message.channel.send(messages.greeting);

        // Ajouter des points à l'utilisateur
        user.points += 10;
        await user.save();
    },
};
