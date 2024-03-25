# Race Application App

## Requirements

- [Docker](https://www.docker.com/products/docker-desktop/) 4.15+
- [NodeJS](https://nodejs.org/en/download) 18+

## Getting Started

### Setting up the project

1. Install and update all the requirements above
2. Clone the repo: `git clone git@github.com:ilimic1/trail-race-app.git`
3. `cp .env.example .env && cp packages/laravel/.env.example packages/laravel/.env` - setup `.env` files
4. `make install` - setup docker containers, install composer dependencies, regenerate config keys, run migrations and seed the database

### Working with the project

Once you have the project setup you can run the following commands in different terminal windows:

- `make backend` - run Laravel API
- `make frontend` - run React SPA
- `make tests` - run integration tests

If you haven't changed any of the host/ports in the `.env` files, the backend API is now available at http://localhost:3000/api (healthcheck at http://localhost:3000/up) and the frontend SPA at http://localhost:3001

## Useful commands

You can use `docker compose run` to run commands in a new Laravel container, or `docker compose exec` to run commands in an existing container if `docker compose up` is already running.

- `docker compose run race_application_service /bin/ash` - login to the Laravel container (eg. to run artisan commands)
- `docker compose run race_application_service /bin/ash -c "./vendor/bin/pint"` - run code formatting
- `docker compose run race_application_service /bin/ash -c "php artisan migrate:fresh && php artisan db:seed"` - drop existing database, run migrations and seed the database

## Improvements

...
