# new-site
A simple NodeJS + [Express](http://expressjs.com/) site all set up and ready to go with username+password authentication using [Passport](http://passportjs.org/) and [Passport-Local](https://www.npmjs.com/package/passport-local), persistent local cookies using [Passport-Remember-Me-Extended](https://www.npmjs.com/package/passport-remember-me-extended), persistent session using [Express-Session](https://www.npmjs.com/package/express-session) and [MongoDB](https://www.mongodb.org/) via [Mongoose](https://www.npmjs.com/package/mongoose) and view templates using [EJS](http://www.embeddedjs.com/).

## Overview
The site includes a **login** page, a **signup** page and an **index** page that requires authentication and the pages are styled using [Bootstrap](http://getbootstrap.com/).

## Routes
`routes\index.js` :
`GET('/')`
* Verifies that the user is authenticated (redirects to ```/login``` on failure).
* Renders ```views\index.ejs```

`routes\login.js` :
`GET('/login')`
* Renders `views\login.ejs`
`POST('/login')`
* Form submission from the login form.
* Redirects to `'/'` on success.

`routes\signup.js`
`GET('/signup')`
* Renders `views\signup.ejs`
`POST('/signup')`
* Form submission for the signup form.
* Redirects to `'/'` on success.

## Data
The `\data\` folder contains:

### site.js
This represents site-specific data (`title` and `description`) that is passed on to the view templates.
### token.js
This file provides the authentication token and methods for generating, saving and consuming tokens.
### user.js
This file provides the user model that is used (and persisted to MongoDB) for authentication and storing the user's credentials.

## Getting Started
1. Update the details for your own site in `package.json`, specifically the `name` and `version`.
1. Update the `title` and `description` of your site in `\data\site.js`
1. Update the `rootURL` for your production site in `\config\authentication.js`
1. Update the connect string for your MongoDB database in `\config\database.js`
1. Update the session cookie `secret` in `app.js`

From here you should be ready to go. Enjoy!
