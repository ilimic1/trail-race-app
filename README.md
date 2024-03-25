## Race Application App

## Requirements

- [Docker](https://www.docker.com/products/docker-desktop/) 4.15+
- [NodeJS](https://nodejs.org/en/download) 18+

## Getting Started

1. Install and update all the requirements above
2. Clone the repo: `git clone git@github.com:ilimic1/trail-race-app.git`
3. `cp .env.example .env && cp packages/laravel/.env.example packages/laravel/.env` - setup `.env` files
4. `make install`
5. `make backend`
6. `make frontend`

## Artisan access

- `php artisan migrate:fresh && php artisan db:seed` - rerun migrations and seed the database
- `./vendor/bin/pint` - format code

To login to the container and run artisan commands, use the following command:

`docker compose run race_application_service /bin/ash`

To run artisan commands from the host, use the following command:

`docker compose exec race_application_service /bin/ash -c "cd /var/www/laravel && php artisan about"`

## Improvements

...
