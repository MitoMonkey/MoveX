Server-side for the MoveX App - REST API and a non-relational database

Tech stack used: MERN
	○ Code editor: VS Code (with ESLint)
    ○ MongoDB with hosting of the database on MongoDB Atlas
    ○ Heroku to host the app
    ○ Node.js
    ○ Node modules:
        § "Express" for routing
        § "morgan" for logging
        § "bodyParser" to be able to read the body of HTML requests
        § "mongoose" as the business logic layer (to connect the MongoDB with node.js)
        § "cors" to allow access to the API from external domains (set to all "*")
        § "express-validator" to validate input fields in the PUSH and PUT endpoints
        § "passport" for for HTML ("passport-local", used for login) and JWT ("passport-jwt", used for all other requests, except "/" endpoint) authentication
        § "jsonwebtoken" to generate JWT tokens
        § "bcrypt" to hash user passwords
    ○ Environment variable to hide the link to the MongoDB Atlas in the Github repo
Things that could still be improved
    ○ For "Add a move to a users list of favorites": check if the move is already in the list to avoid douple entries (& analog for removing a move from the favorites)
    ○ Currently on user who is logged in could, given he has the username of another user, edit their credentials. This can be  fixed by adding a check if the `req.params.Username` is equal to the logged in `Username`, but to get the logged in Username you have to decide the JWT token, so the lesson leaves it out for simplicity.
    ○ Data validation for the Birthday field. Currently on registration it is handled by the mongoose model (returning a string if invalid), and additionally by express-validator for the "edit user data" endpoint (return an HTML if invalid)
    ○ environment variable for the jwtSecret
Links
    ○ https://github.com/MitoMonkey/MoveX
    ○ https://move-x.herokuapp.com/
    ○ https://move-x.herokuapp.com/documentation.html