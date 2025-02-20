const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getUserMessages = require('../utils/getUserMessages');
const words_fr = [
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
const words_en = [
    'apple', 'banana', 'grape', 'orange', 'pear', 'peach', 'strawberry', 'blueberry',
    'pineapple', 'mango', 'watermelon', 'lemon', 'lime', 'cherry', 'kiwi', 'apricot',
    'plum', 'fig', 'date', 'papaya', 'raspberry', 'blackberry', 'pomegranate', 'melon',
    'grapefruit', 'avocado', 'tomato', 'carrot', 'potato', 'onion', 'garlic', 'broccoli',
    'cauliflower', 'spinach', 'lettuce', 'cucumber', 'bell', 'pepper', 'zucchini',
    'eggplant', 'cabbage', 'kale', 'peas', 'beans', 'corn', 'mushroom', 'pumpkin', 'squash',
    'artichoke', 'asparagus', 'beet', 'radish', 'turnip', 'celery', 'parsley', 'cilantro',
    'basil', 'thyme', 'rosemary', 'oregano', 'mint', 'dill', 'sage', 'tarragon', 'chive',
    'clove', 'cinnamon', 'nutmeg', 'ginger', 'turmeric', 'saffron', 'vanilla', 'pepper',
    'salt', 'sugar', 'honey', 'maple', 'syrup', 'chocolate', 'candy', 'cookie', 'cake',
    'pie', 'pudding', 'ice', 'cream', 'yogurt', 'milk', 'cheese', 'butter', 'bread',
    'pasta', 'rice', 'quinoa', 'oatmeal', 'cereal', 'toast', 'sandwich', 'burger', 'pizza',
    'salad', 'soup', 'stew', 'chili', 'sauce', 'dip', 'spread', 'jam', 'jelly', 'smoothie',
    'juice', 'coffee', 'tea', 'water', 'soda', 'beer', 'wine', 'whiskey', 'vodka', 'rum',
    'gin', 'brandy', 'champagne', 'cocktail', 'martini', 'margarita', 'mojito', 'sangria',
    'mule', 'fashioned', 'negroni', 'daiquiri', 'pina', 'colada', 'beer', 'ale', 'lager',
    'stout', 'porter', 'cider', 'mead', 'sports', 'football', 'soccer', 'basketball',
    'baseball', 'hockey', 'tennis', 'golf', 'cricket', 'rugby', 'volleyball', 'swimming',
    'running', 'cycling', 'hiking', 'climbing', 'skiing', 'snowboarding', 'skating',
    'surfing', 'fishing', 'hunting', 'camping', 'kayaking', 'canoeing', 'sailing',
    'diving', 'snorkeling', 'rowing', 'paddle', 'boarding', 'gymnastics', 'dancing',
    'yoga', 'pilates', 'aerobics', 'weightlifting', 'boxing', 'wrestling', 'martial',
    'arts', 'karate', 'judo', 'taekwondo', 'jiu', 'jitsu', 'kickboxing', 'fencing',
    'archery', 'shooting', 'badminton', 'squash', 'table', 'tennis', 'ping', 'pong',
    'billiards', 'pool', 'bowling', 'darts', 'chess', 'checkers', 'backgammon', 'poker',
    'bridge', 'blackjack', 'roulette', 'slot', 'machine', 'bingo', 'lottery', 'crossword',
    'puzzle', 'sudoku', 'jigsaw', 'origami', 'knitting', 'crocheting', 'sewing', 'quilting',
    'embroidery', 'painting', 'drawing', 'sketching', 'sculpting', 'pottery', 'ceramics',
    'photography', 'filmmaking', 'writing', 'poetry', 'novel', 'story', 'essay', 'journal',
    'diary', 'blog', 'vlog', 'podcast', 'radio', 'television', 'movie', 'film', 'show',
    'series', 'drama', 'comedy', 'action', 'thriller', 'horror', 'mystery', 'romance',
    'fantasy', 'science', 'fiction', 'documentary', 'biography', 'autobiography', 'history',
    'geography', 'politics', 'economics', 'science', 'technology', 'engineering', 'math',
    'biology', 'chemistry', 'physics', 'astronomy', 'geology', 'meteorology', 'oceanography',
    'anthropology', 'sociology', 'psychology', 'philosophy', 'religion', 'theology',
    'literature', 'art', 'music', 'theater', 'dance', 'opera', 'ballet', 'musical',
    'concert', 'festival', 'exhibition', 'museum', 'gallery', 'library', 'bookstore',
    'cafe', 'restaurant', 'bar', 'pub', 'club', 'hotel', 'resort', 'spa', 'gym', 'park',
    'zoo', 'aquarium', 'garden', 'farm', 'forest', 'mountain', 'river', 'lake', 'ocean',
    'beach', 'desert', 'savanna', 'rainforest', 'tundra', 'prairie', 'meadow', 'valley',
    'canyon', 'gorge', 'cliff', 'waterfall', 'geyser', 'volcano', 'island', 'peninsula',
    'continent', 'country', 'state', 'province', 'region', 'city', 'town', 'village',
    'neighborhood', 'street', 'road', 'highway', 'freeway', 'bridge', 'tunnel', 'airport',
    'station', 'port', 'harbor', 'dock', 'pier', 'terminal', 'depot', 'garage', 'parking',
    'lot', 'building', 'house', 'apartment', 'condo', 'office', 'store', 'shop', 'market',
    'mall', 'plaza', 'square', 'park', 'playground', 'field', 'stadium', 'arena', 'gym',
    'court', 'track', 'field', 'pool', 'rink', 'ring', 'studio', 'theater', 'hall',
    'auditorium', 'cinema', 'library', 'museum', 'gallery', 'school', 'university',
    'college', 'academy', 'institute', 'center', 'clinic', 'hospital', 'pharmacy',
    'police', 'station', 'fire', 'station', 'post', 'office', 'bank', 'atm', 'machine',
    'restaurant', 'cafe', 'bar', 'pub', 'club', 'hotel', 'motel', 'inn', 'resort', 'spa',
    'gym', 'shop', 'store', 'boutique', 'market', 'mall', 'plaza', 'center', 'kiosk',
    'stall', 'booth', 'stand', 'cart', 'truck', 'vehicle', 'car', 'bus', 'train', 'plane',
    'boat', 'ship', 'subway', 'tram', 'trolley', 'bike', 'motorcycle', 'scooter', 'skateboard',
    'rollerblade', 'wheelchair', 'stroller', 'wagon', 'sled', 'snowmobile', 'hoverboard',
    'segway', 'drone', 'robot', 'machine', 'engine', 'motor', 'pump', 'fan', 'compressor',
    'generator', 'battery', 'charger', 'adapter', 'cable', 'wire', 'plug', 'socket',
    'switch', 'button', 'knob', 'dial', 'lever', 'handle', 'hinge', 'lock', 'key', 'chain',
    'rope', 'cord', 'string', 'thread', 'needle', 'pin', 'clip', 'staple', 'tape', 'glue',
    'paste', 'cement', 'concrete', 'brick', 'stone', 'rock', 'gravel', 'sand', 'dirt',
    'mud', 'clay', 'soil', 'earth', 'grass', 'plant', 'flower', 'tree', 'shrub', 'bush',
    'vine', 'leaf', 'stem', 'root', 'seed', 'fruit', 'vegetable', 'grain', 'wheat',
    'corn', 'rice', 'oat', 'barley', 'rye', 'bean', 'pea', 'lentil', 'chickpea', 'soybean',
    'peanut', 'almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'macadamia',
    'pine', 'nut', 'seed', 'kernel', 'shell', 'pod', 'husk', 'fiber', 'cotton', 'wool',
    'silk', 'linen', 'hemp', 'jute', 'bamboo', 'reed', 'cane', 'wood', 'timber', 'lumber',
    'plywood', 'panel', 'board', 'plank', 'beam', 'pole', 'post', 'railing', 'fence',
    'wall', 'floor', 'ceiling', 'roof', 'window', 'door', 'gate', 'stairs', 'ladder',
    'ramp', 'elevator', 'escalator', 'bridge', 'tunnel', 'road', 'path', 'trail', 'sidewalk',
    'crosswalk', 'intersection', 'roundabout', 'traffic', 'light', 'sign', 'signal', 'beacon',
    'cone', 'barrier', 'fence', 'rail', 'guard', 'rail', 'handrail', 'banister', 'balcony',
    'deck', 'porch', 'patio', 'terrace', 'garden', 'yard', 'lawn', 'courtyard', 'plaza',
    'square', 'park', 'playground', 'field', 'meadow', 'pasture', 'paddock', 'corral',
    'pen', 'enclosure', 'cage', 'aviary', 'aquarium', 'terrarium', 'vivarium', 'zoo',
    'safari', 'sanctuary', 'reserve', 'refuge', 'habitat', 'ecosystem', 'environment',
    'biosphere', 'atmosphere', 'climate', 'weather', 'season', 'spring', 'summer', 'fall',
    'autumn', 'winter', 'snow', 'rain', 'hail', 'sleet', 'ice', 'frost', 'dew', 'fog',
    'mist', 'cloud', 'storm', 'thunder', 'lightning', 'wind', 'breeze', 'gust', 'gale',
    'hurricane', 'tornado', 'cyclone', 'typhoon', 'earthquake', 'volcano', 'eruption',
    'tsunami', 'flood', 'drought', 'wildfire', 'avalanche', 'landslide', 'mudslide',
    'sinkhole', 'meteor', 'comet', 'asteroid', 'planet', 'star', 'galaxy', 'universe',
    'cosmos', 'space', 'astronaut', 'telescope', 'satellite', 'rocket', 'shuttle', 'spacecraft',
    'spaceship', 'space', 'station', 'observatory', 'laboratory', 'research', 'experiment',
    'science', 'technology', 'engineering', 'mathematics', 'physics', 'chemistry', 'biology',
    'geology', 'astronomy', 'meteorology', 'oceanography', 'ecology', 'anthropology',
    'sociology', 'psychology', 'philosophy', 'literature', 'history', 'art', 'music',
    'theater', 'dance', 'opera', 'ballet', 'poetry', 'novel', 'story', 'essay', 'journal',
    'diary', 'blog', 'vlog', 'podcast', 'radio', 'television', 'movie', 'film', 'show',
    'series', 'drama', 'comedy', 'action', 'thriller', 'horror', 'mystery', 'romance',
    'fantasy', 'science', 'fiction', 'documentary', 'biography', 'autobiography', 'travel',
    'adventure', 'exploration', 'journey', 'expedition', 'voyage', 'trip', 'tour', 'safari',
    'cruise', 'holiday', 'vacation', 'resort', 'retreat', 'camp', 'camping', 'hiking',
    'backpacking', 'trekking', 'climbing', 'mountaineering', 'skiing', 'snowboarding',
    'skating', 'surfing', 'diving', 'snorkeling', 'swimming', 'sailing', 'boating',
    'kayaking', 'canoeing', 'rowing', 'fishing', 'hunting', 'birdwatching', 'stargazing',
    'sunbathing', 'picnicking', 'barbecue', 'grilling', 'cooking', 'baking', 'roasting',
    'frying', 'boiling', 'steaming', 'poaching', 'simmering', 'sauteing', 'braising',
    'stewing', 'smoking', 'curing', 'preserving', 'pickling', 'fermenting', 'blending',
    'mixing', 'whisking', 'kneading', 'rolling', 'cutting', 'chopping', 'slicing', 'dicing',
    'peeling', 'grating', 'shredding', 'crushing', 'grinding', 'pounding', 'mashing',
    'pureeing', 'straining', 'sieving', 'draining', 'marinating', 'seasoning', 'spicing',
    'flavoring', 'sweetening', 'salting', 'peppering', 'garnishing', 'plating', 'serving',
    'eating', 'drinking', 'tasting', 'sampling', 'savoring', 'enjoying', 'feasting',
    'celebrating', 'partying', 'dancing', 'singing', 'laughing', 'talking', 'chatting',
    'conversing', 'discussing', 'debating', 'arguing', 'disagreeing', 'agreeing', 'negotiating',
    'bargaining', 'trading', 'buying', 'selling', 'shopping', 'browsing', 'searching',
    'finding', 'discovering', 'exploring', 'learning', 'studying', 'reading', 'writing',
    'drawing', 'painting', 'sculpting', 'photography', 'filmmaking', 'music', 'composing',
    'playing', 'performing', 'singing', 'dancing', 'acting', 'directing', 'producing',
    'editing', 'broadcasting', 'streaming', 'recording', 'mixing', 'mastering', 'publishing',
    'printing', 'binding', 'packaging', 'shipping', 'delivering', 'receiving', 'storing',
    'organizing', 'arranging', 'cleaning', 'washing', 'drying', 'ironing', 'folding',
    'mending', 'repairing', 'fixing', 'building', 'constructing', 'assembling', 'disassembling',
    'demolishing', 'destroying', 'renovating', 'remodeling', 'decorating', 'painting',
    'wallpapering', 'tiling', 'flooring', 'carpeting', 'plumbing', 'wiring', 'insulating',
    'roofing', 'siding', 'framing', 'glazing', 'plastering', 'drywalling', 'carpentry',
    'masonry', 'concreting', 'landscaping', 'gardening', 'planting', 'watering', 'fertilizing',
    'weeding', 'pruning', 'trimming', 'mowing', 'raking', 'sweeping', 'shoveling', 'digging',
    'hoeing', 'tilling', 'plowing', 'harvesting', 'reaping', 'threshing', 'winnowing',
    'grinding', 'milling', 'baking', 'cooking', 'brewing', 'distilling', 'fermenting',
    'preserving', 'canning', 'freezing', 'drying', 'smoking', 'curing', 'pickling', 'fermenting'
];


function scrambleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function getRandomWord(language) {
    const words = language === 'fr' ? words_fr : words_en;
    return words[Math.floor(Math.random() * words.length)];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scramble')
        .setDescription('Starts scrambled word game'),
    async execute(interaction) {
        const userMessages = await getUserMessages(interaction);
        const trad = userMessages.messages.scramble;
        const language = userMessages.language;

        const word = getRandomWord(language);
        const scrambledWord = scrambleWord(word);

        // Create and send the initial embed
        const promptEmbed = new EmbedBuilder()
            .setColor(process.env.EMBDED_COLOR)
            .setTitle('Scramble Game')
            .setDescription(trad.prompt.replace("{word}", scrambledWord))
            .setFooter({ text: trad.you_have_30s_to_guess });

        await interaction.reply({ embeds: [promptEmbed] });

        let attempts = 0;
        const maxAttempts = 3;
        let guessedCorrectly = false;

        while (attempts < maxAttempts && !guessedCorrectly) {
            const filter = response => response.author.id === interaction.user.id;

            try {
                const collected = await interaction.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 30000, // 30 seconds for each attempt
                    errors: ['time']
                });

                const userGuess = collected.first().content.toLowerCase();

                if (userGuess === word) {
                    const successEmbed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle(trad.correct_guess)
                        .setDescription(trad.correct)
                        .setFooter({ text: trad.good_job });

                    await interaction.followUp({ embeds: [successEmbed] });
                    guessedCorrectly = true;
                } else {
                    attempts++;
                    if (attempts < maxAttempts) {
                        const incorrectEmbed = new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle(trad.incorrect_guess)
                            .setDescription(trad.incorrect.replace("{attempts}", maxAttempts - attempts))
                            .setFooter({ text: `${trad.you_have} ${maxAttempts - attempts} ${trad.attempts_left}` });

                        await interaction.followUp({ embeds: [incorrectEmbed] });
                    }
                }
            } catch (error) {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(trad.times_up)
                    .setDescription(trad.timeout)
                    .setFooter({ text: `${trad.attempts_used} ${attempts + 1}` });

                await interaction.followUp({ embeds: [timeoutEmbed] });
                attempts++;
            }
        }

        if (!guessedCorrectly) {
            const gameOverEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(trad.gameOver)
                .setDescription(trad.game_over.replace("{word}", word))
                .setFooter({ text: trad.better_luck_next_time });

            await interaction.followUp({ embeds: [gameOverEmbed] });
        }
    },
};