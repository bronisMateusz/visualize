# Install php.
FROM php:8.1-apache as php

WORKDIR /app

# Get php extensions installer.
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN \
  # Install php extensions.
  chmod +x /usr/local/bin/install-php-extensions && \
  IPE_GD_WITHOUTAVIF=1 install-php-extensions gd opcache apcu pdo_mysql memcached uploadprogress xdebug && \
  # Install composer.
  apt-get update && apt-get install --assume-yes zip unzip git && \
  install-php-extensions @composer && \
  # Install Node.js
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y nodejs && \
  apt-get install -y build-essential && \
  # Install drush launcher.
  curl -OL https://github.com/drush-ops/drush-launcher/releases/latest/download/drush.phar && \
  chmod +x drush.phar && mv drush.phar /usr/local/bin/drush && \
  # Enable apache mod_rewrite.
  a2enmod rewrite

# Point apache document root to drupal.
ENV APACHE_DOCUMENT_ROOT /app/web
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
