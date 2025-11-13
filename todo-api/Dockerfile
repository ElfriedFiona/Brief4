# Utilise PHP 8.2 avec FPM
FROM php:8.2-fpm

# Définir le dossier de travail
WORKDIR /var/www/html

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libzip-dev && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install pdo_mysql mbstring zip exif pcntl gd

# Installer Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Copier le code source dans le conteneur
COPY . .

# Installer les dépendances PHP
RUN composer install --no-dev --optimize-autoloader

# Donner les permissions à Laravel
RUN chmod -R 777 storage bootstrap/cache

# Définir la variable d'environnement
ENV PORT=8000

# Exposer le port 8000
EXPOSE 8000

# Lancer le serveur Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
