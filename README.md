# Drupal

## Setup project

1. Create `.env` based on `.env.example`.
2. Start docker containers:
   - for prod: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
   - for local-dev: `docker compose up -d`
   - after changes to Dockerfile `docker compose build` is required to rebuild image
3. Install composer dependencies: `docker exec -it <drupal_container> composer install`
4. Import database (optional)

## Start project

- for prod: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
- for local-dev: `docker compose up -d`

## Stop project

`docker compose down`

## List running containers

`docker compose ps`

## Import db

`docker exec -i <db_container> mysql -u<user> -p<pass> <database> < dump.sql`

## Drush

`docker exec -it <drupal_container> vendor/bin/drush ...`

## Composer

`docker exec -it <drupal_container> composer ...`
