# Utiliser l'image officielle de Node.js comme image de base
FROM node:alpine AS builder

# Créer et définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code source de l'application
COPY . .

# Définir la commande pour démarrer l'application
CMD ["node", "discordBot.js"]
