const axios = require('axios');

module.exports = {
    name: 'guessword',
    description: 'Jeu de devinez le mot',
    async execute(message, args) {
        const words = [
            // Fruits
            'pomme', 'banane', 'raisin', 'orange', 'poire', 'pêche', 'fraise', 'myrtille',
            'ananas', 'mangue', 'pastèque', 'citron', 'citron vert', 'cerise', 'kiwi', 'abricot',
            'framboise', 'cassis', 'groseille', 'mûre', 'papaye', 'litchi', 'grenade', 'nectarine',
            'mandarine', 'pamplemousse', 'melon', 'figue', 'coing', 'prune', 'mirabelle', 'datte',
            'goji', 'physalis', 'kaki', 'carambole', 'fruit de la passion',

            // Animaux
            'chat', 'chien', 'cheval', 'vache', 'mouton', 'cochon', 'poule', 'canard',
            'oiseau', 'poisson', 'lapin', 'serpent', 'éléphant', 'tigre', 'lion', 'girafe',
            'zèbre', 'ours', 'renard', 'singe', 'crocodile', 'rhinocéros', 'hippopotame',
            'kangourou', 'panda', 'koala', 'perroquet', 'dauphin', 'requin', 'baleine',

            // Objets
            'table', 'chaise', 'ordinateur', 'livre', 'stylo', 'lampe', 'téléphone', 'bureau',
            'clé', 'porte', 'fenêtre', 'chaussure', 'vêtements', 'montre', 'canapé', 'rideau',
            'assiette', 'fourchette', 'couteau', 'cuillère', 'verre', 'bouteille', 'mug',

            // Lieux
            'maison', 'école', 'bureau', 'restaurant', 'hôpital', 'parc', 'plage', 'montagne',
            'forêt', 'rue', 'place', 'centre commercial', 'musée', 'cinéma', 'bibliothèque',
            'stade', 'gare', 'aéroport', 'pont', 'hôtel',

            // Véhicules
            'voiture', 'moto', 'vélo', 'bus', 'train', 'avion', 'bateau', 'scooter',
            'camion', 'hélicoptère', 'tram', 'monorail', 'char', 'sous-marin', 'skateboard',

            // Couleurs
            'rouge', 'bleu', 'vert', 'jaune', 'orange', 'violet', 'rose', 'gris',
            'noir', 'blanc', 'marron', 'beige', 'turquoise', 'cyan', 'indigo', 'argent',

            // Nourriture
            'pizza', 'pâtes', 'hamburger', 'sushi', 'tacos', 'sandwich', 'salade', 'soupe',
            'steak', 'omelette', 'croissant', 'baguette', 'quiche', 'pâtisserie', 'glace',
            'chocolat', 'bonbon', 'café', 'thé', 'jus'
        ];

        const secretWord = words[Math.floor(Math.random() * words.length)];
        const revealedLetters = Array(secretWord.length).fill('_');
        const maxAttempts = 6;
        let attempts = 0;

        const revealWord = () => revealedLetters.join(' ');

        await message.channel.send(`**🎉 Jeu de Devinez le Mot 🎉**\n\nJe pense à un mot de ${secretWord.length} lettres. 🤔\nVoici le mot à deviner : ${revealWord()}\nVous avez ${maxAttempts} tentatives et 5 minutes pour deviner les lettres ! 🕵️‍♂️⏳`);

        const filter = response => response.content.length === 1 && /^[a-zA-Z]$/.test(response.content);

        const collector = message.channel.createMessageCollector({ filter, time: 300000 }); // 5 minutes = 300000 millisecondes

        collector.on('collect', response => {
            const letter = response.content.toLowerCase();

            if (secretWord.includes(letter)) {
                let letterRevealed = false;
                for (let i = 0; i < secretWord.length; i++) {
                    if (secretWord[i] === letter && revealedLetters[i] === '_') {
                        revealedLetters[i] = letter;
                        letterRevealed = true;
                    }
                }
                if (!revealedLetters.includes('_')) {
                    collector.stop('win');
                } else if (letterRevealed) {
                    message.channel.send(`🎉 Bien joué ! Le mot ressemble maintenant à ceci : ${revealWord()} 🎉`);
                }
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    collector.stop('lose');
                } else {
                    message.channel.send(`❌ Mauvaise lettre ! Il vous reste ${maxAttempts - attempts} tentatives. ${revealWord()} ❌`);
                }
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'win') {
                message.channel.send(`🎊 Félicitations ! Vous avez deviné le mot : **${secretWord}** 🎉🎉`);
            } else if (reason === 'lose') {
                message.channel.send(`😢 Désolé ! Vous avez utilisé toutes vos tentatives. Le mot était : **${secretWord}**. Bonne chance la prochaine fois ! 🌟`);
            } else {
                message.channel.send(`⏳ Temps écoulé ! Le mot était : **${secretWord}**. Merci d'avoir joué ! 🎉`);
            }
        });
    },
};
