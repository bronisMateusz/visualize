# Start local dev environment.
dev:
	docker compose up -d
	docker compose exec -it app composer install
	docker compose exec -it app yarn
	docker compose exec -it app yarn build

# Stop local dev environment.
down:
	docker compose down

prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile adminer up -d
	docker exec -t app composer install
	docker exec -t app drush deploy
	docker exec -t app yarn
	docker exec -t app yarn build
	docker exec -t app rm -rf node_modules

ssh:
	docker compose exec -it app bash

# Statically analyse custom code for compliance with standars and best pracices.
check:
	docker compose exec -it app composer check
	docker compose exec -it app yarn

check-fix:
	docker compose exec -it app composer check --fix
	docker compose exec -it app yarn format

export-translations:
	docker compose exec -it app drush locale:export pl --types=customized > drupal/translations/custom-translations.pl.po --no-interaction

import-translations:
	docker compose exec -it app drush locale:import pl ../translations/custom-translations.pl.po --type=customized --override=all --no-interaction
