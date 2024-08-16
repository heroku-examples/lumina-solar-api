# Lumina Solar API

API for use in software demos.

## Prerequisites
* A [Heroku](https://www.heroku.com) account

* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli) installed


## Deploying to Heroku
Clone this repo and open the resulting directory in your terminal

Create **Heroku app**
```
heroku create <username>-lumina-solar
```

Provision **Heroku Postgres add-on** (incurs cost)
```
heroku addons:create heroku-postgresql:essential-0
```

Follow CLI instructions to “check creation process”, continue when “State” is ```created```

Deploy the app
```
git push heroku main
```

Import the database schema
```
heroku run npm run setup
```

Seed the database with example data
```
heroku run node data/seed.js
```

## Usage

JSON OAS schema available at path ```/api-docs/json```

To browse the schema visually, open path ```/``` in a web browser
