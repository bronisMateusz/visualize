# Install php.
FROM php:8.1-apache as base

ARG UID=1000
ARG GID=1000

# Get php extensions installer.
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN set -xe \
  && apt-get update \
  # Install utils.
  && apt-get install -y --no-install-recommends \
    apt-transport-https \
    git \
    unzip \
    zip \
  # Install php extensions.
  && chmod +x /usr/local/bin/install-php-extensions \
  && install-php-extensions \
    apcu \
    gd \
    memcached \
    opcache \
    pdo_mysql \
    uploadprogress \
  # Install composer.
  && install-php-extensions @composer \
  # Install Node.js
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash \
  && apt-get install -y nodejs \
  && corepack enable \
  # Install drush launcher.
  && curl -OL https://github.com/drush-ops/drush-launcher/releases/latest/download/drush.phar \
  && chmod +x drush.phar && mv drush.phar /usr/local/bin/drush \
  # Enable apache modules.
  && a2enmod rewrite headers ssl \
  # Add non root user:
  && usermod -u ${UID} www-data \
  && groupmod -g ${GID} www-data \
  && chown -R ${UID}:${GID} /var/www/
FROM base

WORKDIR /var/www/html
COPY --chown=${UID}:${GID} www .
# Mount 000-default.conf under sites-available
COPY ./config/vhost.apache2.conf /etc/apache2/sites-available/000-default.conf

# Switch to use a non root user.
USER ${UID}:${GID}
