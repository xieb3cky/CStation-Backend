
# C Station Backend

Link to [Frontend](https://github.com/xieb3cky/Cstation_Frontend) 

Web application that helps users find nearby electric vehicle (EV) chargers. The application is built using JavaScript, Node.js, Express, Bcrypt, JWT token, and PostgreSQL.


## Features

- User registration and authentication using bcrypt and JWT token. 
- Search for EV charging stations based on the user's location & search criteria. 
- Save favorite charging stations. 
- View charging station details.


## Code Overview

### Database Schema
![](https://github.com/xieb3cky/CStation-Backend/blob/master/demo/db%20diagram.png)

### Dependencies
- [express.js](https://github.com/expressjs/express) - The server for handling and routing HTTP requests.
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication. 
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Used to hash passwords. 
- [cors](https://github.com/expressjs/cors) - Middleware used to enable Cross-Origin Resource Sharing (CORS) in an Express application.
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a .env file into process.env. 
- [pg](https://www.npmjs.com/package/pg) - Used to connect to databse and execute SQL queries.
- [jsonschema](https://www.npmjs.com/package/jsonschema) - Utilized to validate form data.

### Application Structure

- `app.js` - This file includes middleware, routes for user, authentication, stations and favorites, error handling for 404 and generic errors.
- `config.js` - This file contains configuration used for password hashing and JSON Web Token (JWT) authentication in our application.
- `server.js` - This file starts the Node.js server.
- `schema/` - This folder contains the JSONschema definitions for validating data. 
- `routes/` - This folder contains the route definitions for view logic (routing).
- `models/` - This folder contains the class defintions for model logic (database).

![](https://github.com/xieb3cky/CStation-Backend/blob/master/demo/cstation-backend.png)


