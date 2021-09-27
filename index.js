const express = require('express'), 
    morgan = require('morgan'), // module for logging
    bodyParser = require('body-parser'), // module to parse the body of an API request (eg: "let newUser = req.body;")
    mongoose = require('mongoose'), // business layer logic to link Node and the MongoDB
    Models = require('./models.js'); // Mongoose models representing the MoveX_DB (MongoDB) collections

const app = express(); // encapsulates Express’s functionality to configure the web server

const Moves = Models.Move; // load the mongoose model defined in models.js
const Users = Models.User;

/*
// connect mongoose to the local MongoDB
mongoose.connect('mongodb://localhost:27017/MoveX_DB', { useNewUrlParser: true, useUnifiedTopology: true });
*/
// connect mongoose to the (online) MongoDB Atlas, added as an environment variable AKA Config Var on Heroku (to keep it hidden on Github)
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// Cross-Origin Resource Sharing - to connect to the API from frontends on different domains
const cors = require('cors');
/* let allowedOrigins = "https://move-x.netlify.app/";
// , 'http://localhost:8080', 'http://localhost:1234', 'https://move-x.netlify.app/'
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
})); */
app.use(cors());

const { check, validationResult } = require('express-validator'); // module to validate input formats

// other middleware
app.use(morgan('common')); // load "common" logging rules
app.use(express.static('public')); // automatically route all files in the "public" folder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth'); // custom module for the /login endpoint
auth(app);
const passport = require('passport'); // module for HTML and JWT authentication
require('./passport');

// --- ROUTING ---

// welcome / root
app.get('/', (req, res) => {
    res.send('Welcome to MoveX !');
});

// GET list of all moves
app.get('/moves', passport.authenticate('jwt', { session: false }), (req, res) => {
    Moves.find()
        .then((moves) => {
            res.status(201).json(moves);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// GET details about one move
app.get('/moves/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Moves.findOne({ Title: req.params.Title })
        .then((move) => {
            res.json(move);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// GET data about a style
app.get('/styles/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Moves.findOne({ "Style.Name": req.params.Name })
        .then((move) => {
            res.json(move.Style);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// GET data about a source
app.get('/sources/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Moves.findOne({ "Source.Name": req.params.Name })
        .then((move) => {
            res.json(move.Source);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Register new user 
// THIS ENDPOINT DOES NOT NEED ANY AUTHENTICATION OFC
    /* We’ll expect JSON in this format
    {
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
    } */
app.post('/users',
    [ // express-validator logic
        check('Username', 'Username of min 5 characters is required.').isLength({ min: 5 }),
        check('Username', 'Username has to be only alphanumeric.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Update a user's info, by username (using a callback rather than the ES6 functions then() and catch() )
    /* We’ll expect JSON in this format
    {
    Username: String, (required)
    Password: String, (required)
    Email: String, (required)
    Birthday: Date
    }*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), 
    [
        check('Username', 'Username of min 5 characters is required.').isLength({ min: 5 }),
        check('Username', 'Username has to be only alphanumeric.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail(),
        check('Birthday', 'Birthday needs to be in the format YYY-MM-DD').optional().isDate() //not necessary because mongoose model also validates it, but here the result is JSON
    ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true }, // This line makes sure that the updated document is returned into the callback
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Add a move to a user's list of favorites
app.post('/users/:Username/moves/:MoveID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        // TO ADD: validate if the move is already in the list, otherwise it will be double
        $push: { FavoriteMoves: req.params.MoveID }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// Remove favorite from list
app.delete('/users/:Username/moves/:MoveID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMoves: req.params.MoveID }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});


// Get all users --- NOT AN OFFICIAL API ENDPOINT
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username --- NOT A OFFICIAL API ENDPOINT
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// handling for errors that have not be handled anywhere else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! Check the console for more details.');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});