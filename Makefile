# Start local dev environment.
dev:
	docker compose up -d
	docker compose exec -it visualize-app composer install
	docker compose exec -it visualize-app yarn
	docker compose exec -it visualize-app yarn build

# Stop local dev environment.
down:
	docker compose down

prod:
	docker compose build
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile adminer up -d
	docker exec -t visualize-app drush deploy

ssh:
	docker compose exec -it visualize-app bash

# Statically analyse custom code for compliance with standars and best pracices.
check:
	docker compose exec -it visualize-app composer check
	docker compose exec -it visualize-app yarn

check-fix:
	docker compose exec -it visualize-app composer check --fix
	docker compose exec -it visualize-app yarn format

export-translations:
	docker compose exec -it visualize-app drush locale:export pl --types=customized > drupal/translations/custom-translations.pl.po --no-interaction

import-translations:
	docker compose exec -it visualize-app drush locale:import pl ../translations/custom-translations.pl.po --type=customized --override=all --no-interaction
