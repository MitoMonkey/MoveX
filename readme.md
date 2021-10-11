# MoveX-backend
Server-side for the MoveX App - REST API and a non-relational database

Find the frontend here: [MoveX client](https://github.com/MitoMonkey/MoveX-client)

## Live Demo
[MoveX backend](https://move-x.herokuapp.com/)

[Screenshot](./src/Sreenshot.png)

## Documentation
All API endpoints can be found here: [MoveX API documentation](https://move-x.herokuapp.com/documentation.html)

## Features
* Return a list of ALL moves to the user
* Return data (description, category, difficulty, related moves, coach/teacher, whether it’s featured or not) about a single move by title to the user 
* Return data about a style (description) by name/title (e.g., “Thriller”) 
* Return data about a the source (teacher, channel/medium (Youtube, …), bio, qualifications, birth year, location, contact) by teacher/channel name 
* Allow new users to register 
* Allow users to update their user info (username, password, email, date of birth)
* Allow users to add a move to their list of favorites/projects
* Allow users to remove a movie from their list of favorites 
* Allow existing users to deregister 

## Built With
MERN Tech stack (only the frontend is built using React library)
* Code editor: VS Code (with ESLint)
* MongoDB with hosting of the database on MongoDB Atlas
* Heroku to host the app
* Node.js
* Node dependencies:
    * "Express" for routing
    * "morgan" for logging
    * "bodyParser" to be able to read the body of HTML requests
    * "mongoose" as the business logic layer (to connect the MongoDB with node.js)
    * "cors" to allow access to the API from external domains (set to all "*")
    * "express-validator" to validate input fields in the PUSH and PUT endpoints
    * "passport" for for HTML ("passport-local", used for login) and JWT ("passport-jwt", used for all other requests, except "/" endpoint) authentication
    * "jsonwebtoken" to generate JWT tokens
    * "bcrypt" to hash user passwords
* Environment variable to hide the link to the MongoDB Atlas in the Github repo

## Things that could still be improved
* For "Add a move to a users list of favorites": check if the move is already in the list to avoid douple entries (& analog for removing a move from the favorites)
* Currently on user who is logged in could, given he has the username of another user, edit their credentials. This can be  fixed by adding a check if the `req.params.Username` is equal to the logged in `Username`, but to get the logged in Username you have to decide the JWT token, so the lesson leaves it out for simplicity.
* Data validation for the Birthday field. Currently on registration it is handled by the mongoose model (returning a string if invalid), and additionally by express-validator for the "edit user data" endpoint (return an HTML if invalid)
* environment variable for the jwtSecret

## Git repo links
* [main repo](https://github.com/MitoMonkey/MoveX-backend)
* [issues page](https://github.com/MitoMonkey/MoveX-client/issues).


