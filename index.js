let topMoves = [
    {
        title: 'Macaco',
        cues: 'Instructions how to do the move',
        styles: 'Capoeira, FlowAcrobatics', // analog to "genre"
        source: { // analog to "director"
            mover: 'Mestre',
            weblink: 'http://youtube.com/Macaco'
        },
        featured: 'yes'
    },
    {
        title: 'pushup',
        cues: 'instructions how to do the move',
        styles: 'bodyweight strength', // analog to "genre"
        source: { // analog to "director"
            mover: 'Fitboy',
            weblink: 'http://youtube.com/Pushup'
        },
        featured: 'no'
    },
    {
        title: 'Aerial',
        cues: 'Instructions how to do the move',
        styles: 'tumbling', // analog to "genre"
        source: { // analog to "director"
            mover: 'Gymnast',
            weblink: 'http://youtube.com/aerial'
        },
        featured: 'yes'
    }
];

let users = [
    {
        name: "Jason",
        email: "jason@mail.com",
        favorites: ""
    }
];

const express = require('express'), 
    morgan = require('morgan'), // module for logging
    bodyParser = require('body-parser'), // module to parse the body of an API request (eg: "let newUser = req.body;")
    uuid = require('uuid'), // module to create unique IDs
    mongoose = require('mongoose'), // business layer logic to link Node and the MongoDB
    Models = require('./models.js'); // Mongoose models representing the MoveX_DB (MongoDB) collections

const app = express(); // encapsulates Express’s functionality to configure your web server
const Moves = Models.Move; // load the mongoose modules defined in models.js
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/MoveX_DB', { useNewUrlParser: true, useUnifiedTopology: true });

// "use" middleware
app.use(morgan('common')); // load "common" logging rules
app.use(express.static('public')); // automatically route all files in the "public" folder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- ROUTING ---

// welcome / root
app.get('/', (req, res) => {
    res.send('Welcome to MoveX !');
});

// GET list of all moves
app.get('/moves', (req, res) => {
    res.json(topMoves);
});

// GET details about one move
app.get('/moves/:name', (req, res) => {
    res.json(topMoves.find((move) => { return move.title === req.params.name }));
});

// GET data about a style - NOT WORKING YET because database does not exist yet
app.get('/styles/:name', (req, res) => {
    res.send('Successful GET request returning data on the style: ' + req.params.name);
});

// GET data about a source - NOT WORKING YET because database does not exist yet
app.get('/sources/:mover', (req, res) => {
    // res.json(topMoves.find((source) => { return source.source.mover === req.params.mover}));
    res.send('Successful GET request returning data on the content source by name of the mover: ' + req.params.mover);
});

// Register new user
    /* We’ll expect JSON in this format
    {
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
    } */
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
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
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true }, // This line makes sure that the updated document is returned into the callback:
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
app.delete('/users/:Username', (req, res) => {
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
app.post('/users/:Username/moves/:MoveID', (req, res) => {
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
app.delete('/users/:Username/moves/:MoveID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        // TO ADD: validate if the move is already in the list, otherwise it will be double
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


// Get all users --- NOT A DEFINED API ENDPOINT
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username --- NOT A DEFINED API ENDPOINT
app.get('/users/:Username', (req, res) => {
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
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});