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

// Update user data
app.put('/users/:name/:newName', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });

    if (user) {
        user.name = req.params.newName;
        res.status(201).send('Username ' + req.params.name + ' was changed to ' + req.params.newName);
    } else {
        res.status(404).send('Student with the name ' + req.params.name + ' was not found.');
    }
});

// Deregister a user - THIS FUNCTION SEEMS TO HAVE AN ERROR AS IT DOES NOT SEND ANYTHING BACK TO POSTMAN YET
app.delete('/users/:name', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
    if (!user) {
        const message = 'Missing name in URL';
        res.status(400).send(message);
    } else {
        let index = users.indexOf(user);
        delete users[index];
        res.status(201).send('Successful DELETE request to remove useraccount for ' + req.params.name);
    }
});

// Add move to favorite list
app.post('/users/:name/favorites/:move', (req, res) => {
    // let user = req.params.name;
    // let newFavorite = req.body;
    
    // some "if..." needed to catch errors
    res.send('Successful POST request to add the move ' + req.params.move + ' to user account of ' + req.params.name);
});

// Remove favorite from list
app.delete('/users/:name/favorites/:move', (req, res) => {
    // let user = req.params.name;
    // let favorite = req.body;

    // some "if..." needed to catch errors
    res.send('Successful DELETE request to remove ' + req.params.move + ' from user account of ' + req.params.name);
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