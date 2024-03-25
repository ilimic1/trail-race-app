setup:
	docker compose run race_application_service /bin/ash -c "cd /var/www/laravel && composer install"
	docker compose down
	npm --prefix ./packages/frontend i

backend:
	docker compose up

frontend:
	npm --prefix ./packages/frontend run dev
