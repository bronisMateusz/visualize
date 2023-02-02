# Start local dev environment.
dev:
	docker compose up -d
	docker compose exec -it visualize-app composer install
	docker compose exec -it visualize-app yarn
	docker compose exec -it visualize-app yarn build

# Stop local dev environment.
dev-down:
	docker compose down

ssh:
	docker compose exec -it visualize-app bash

# Statically analyse custom code for compliance with standars and best pracices.
check:
	docker compose exec -it visualize-app composer check

check-fix:
	docker compose exec -it visualize-app composer check --fix

export-translations:
	docker compose exec -it visualize-app drush locale:export pl --types=customized > drupal/translations/custom-translations.pl.po --no-interaction

import-translations:
	docker compose exec -it visualize-app drush locale:import pl ../translations/custom-translations.pl.po --type=customized --override=all --no-interaction
