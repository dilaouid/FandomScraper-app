FROM node:20-slim as builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copier les fichiers de configuration
COPY package.json ./
COPY tsconfig.json ./

# Installer toutes les dépendances (sans lockfile)
RUN pnpm install --no-frozen-lockfile

# Copier le reste du code source
COPY . .

# Build de l'application
RUN pnpm build

# Vérifier que le build a été créé
RUN ls -la dist/

# ---------- Production Stage ----------
FROM node:20-slim

WORKDIR /app

# Installer pnpm globalement
RUN npm install -g pnpm

# Copier les fichiers de configuration nécessaires
COPY package.json ./

# Installer uniquement les dépendances de production (sans lockfile)
RUN pnpm install --prod --no-frozen-lockfile

# Copier les fichiers build depuis le builder
COPY --from=builder /app/dist ./dist

# Vérifier que les fichiers sont bien copiés
RUN ls -la dist/

# Exposer le port utilisé par l'application
EXPOSE 3000

# Démarrer l'application
CMD ["node", "--experimental-specifier-resolution=node", "dist/app.js"]