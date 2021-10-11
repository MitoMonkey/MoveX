# MoveX-backend
Server-side for the MoveX App - A REST API and a non-relational database

## Links
[MoveX backend](https://move-x.herokuapp.com/)

Find the frontend here: [MoveX client](https://github.com/MitoMonkey/MoveX-client)
[Live app](https://move-x.netlify.app/)
![Screenshot](./Sreenshot.png)

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
* (Postman to test the API endpoints)
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

## Local testing
( Set up the project with all dependencies: `npm install` (in project folder) )
1. In index.js change connection to local DB (out-commented)
2. Run server: `node index.js` (> ctrl + C to terminate)
3. access local mongoDB though monogo shell: `mongo` (`quit` to exit)
  * To see a list of all databases: `show dbs`
  * To see which database MongoDB is currently set to: `db`
  * Set working DB: `use MoveX_DB`
  * To view all of the collections in your current database: `db.getCollectionNames()`
  * Create new collection: `db.createCollection("collectionName")`
  * Insert new document into a collection: `db.collectionName.insertOne(document-to-insert)`
  * Read all records from a collection: `db.[collectionName].find().pretty()`
  * If you only want to see the first record in a collection: `db.[collectionName].findOne()`

## Deployment
* `git push heroku master`

## Things that could still be improved
* Currently on user who is logged in could, given he has the username of another user, edit their profile. This can be fixed by adding a check if the `req.params.Username` is equal to the logged in `Username`. But the issue is handled in the frontend.
* Data validation for the Birthday field. Currently on registration it is handled by the mongoose model (returning a string if invalid), and additionally by express-validator for the "edit user data" endpoint (return an HTML if invalid). But there is validation at the frontend as well.
* Use environment variable for the jwtSecret

## Git repo links
* [issues page](https://github.com/MitoMonkey/MoveX-client/issues)


