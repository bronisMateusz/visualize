FROM bitnami/minideb as base

ARG UID=1000
ARG GID=1000

ENV APACHE_RUN_DIR=/var/run/apache2

RUN set -xe; \
  install_packages apt-transport-https ca-certificates curl gnupg2 \
  software-properties-common patch less cron vim default-mysql-client-core; \
  curl -sSL https://packages.sury.org/php/README.txt | bash -x; \
  # Install php.
  install_packages \
    php8.2-fpm php8.2-gd php8.2-opcache php8.2-apcu php8.2-pdo-mysql php8.2-bz2 \
    php8.2-memcached php8.2-uploadprogress php8.2-zip php8.2-dom php8.2-bcmath \
    php8.2-calendar php8.2-exif php8.2-gettext php8.2-intl php8.2-mysqli \
    php8.2-shmop php8.2-sockets php8.2-sysvmsg php8.2-sysvsem php8.2-sysvshm php8.2-xsl \
    php8.2-xmlwriter php8.2-simplexml php8.2-curl php8.2-mbstring php8.2-xdebug; \
  touch /var/log/php8.2-fpm.log; chown -R ${UID}:${GID} /var/log/php8.2-fpm.log; \
  mkdir -p /run/php; chown -R ${UID}:${GID} /run/php; \
  { \
    echo '[www]'; \
    echo 'clear_env = no'; \
  } > /etc/php/8.2/fpm/pool.d/zz-custom.conf; \
  # By default disable xdebug.
  phpdismod xdebug; \
  # Install apache.
  install_packages apache2 libapache2-mod-fcgid; \
  a2enmod alias headers rewrite proxy proxy_http proxy_fcgi; \
  a2enconf php8.2-fpm; \
  ln -sfT /dev/stderr "/var/log/apache2/error.log"; \
  ln -sfT /dev/stdout "/var/log/apache2/access.log"; \
  ln -sfT /dev/stdout "/var/log/apache2/other_vhosts_access.log"; \
  mkdir -p /var/run/apache2; \
  chown -R ${UID}:${GID} /var/log/apache2 /var/run/apache2 /var/lib/apache2/fcgid /var/www; \
  usermod -u $UID www-data; groupmod -g $GID www-data; chmod -R 775 /var/www; \
  # Install composer.
  install_packages zip unzip git; \
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"; \
  php -r "if (hash_file('sha384', 'composer-setup.php') === '55ce33d7678c5a611085589f1f3ddf8b3c52d662cd01d4ba75c0ee0459970c2200a51f492d557530c71c15d8dba01eae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"; \
  php composer-setup.php; \
  php -r "unlink('composer-setup.php');"; \
  mv composer.phar /usr/local/bin/composer; \
  # Install Node.js
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -; \
  install_packages nodejs; \
  corepack enable yarn; \
  # Install drush launcher.
  curl -OL https://github.com/drush-ops/drush-launcher/releases/latest/download/drush.phar; \
  chmod +x drush.phar; mv drush.phar /usr/local/bin/drush

FROM base

ARG UID=1000
ARG GID=1000

WORKDIR /var/www/drupal
RUN chown $UID:$GID /var/www/drupal

# Update source code.
COPY --chown=$UID:$GID drupal .

# Customize server config.
COPY ./docker-entrypoint /usr/local/bin/
COPY ./config/php.local.ini /etc/php/8.2/cli/conf.d/php.local.ini
COPY ./config/php.local.ini /etc/php/8.2/fpm/conf.d/php.local.ini
COPY ./config/vhost.apache2.conf /etc/apache2/sites-available/000-default.conf
COPY ./config/crontab /etc/cron.d/drupal-cron

RUN \
  # Make sure entrypoint is executable.
  chmod +x /usr/local/bin/docker-entrypoint; \
  # Drush locale:update complain that can't copy translations because of lack of this directory
  mkdir -p web/sites/default/files/translations; chown -R www-data:www-data web/sites/default/files; \
  # Configure cron.
  chmod 0644 /etc/cron.d/drupal-cron; \
  chmod u+s /usr/sbin/cron; \
  crontab -u www-data /etc/cron.d/drupal-cron


# Switch to use a non-root user.
USER $UID:$GID

RUN \
  # Install composer dependencies.
  composer install --no-cache --no-dev; \
  # Build frontend assets.
  yarn; yarn build; rm -rf node_modules

EXPOSE 80
ENTRYPOINT [ "docker-entrypoint" ]
