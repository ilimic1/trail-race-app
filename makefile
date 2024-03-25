install:
	docker compose run race_application_service /bin/ash -c "composer install"
	docker compose run race_application_service /bin/ash -c "php artisan key:generate"
	docker compose run race_application_service /bin/ash -c "php artisan jwt:secret --force --quiet --no-interaction"
	docker compose run race_application_service /bin/ash -c "php artisan migrate:fresh && php artisan db:seed"
	docker compose down
	npm --prefix ./packages/frontend i

regenerate-jwt-secret:
	docker compose run race_application_service /bin/ash -c "php artisan jwt:secret --force --quiet --no-interaction"

backend:
	docker compose up

frontend:
	npm --prefix ./packages/frontend run dev

test:
	docker compose exec race_application_service /bin/ash -c "php artisan test"
