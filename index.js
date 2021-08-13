let topMoves = [
    {
        title: 'Macaco',
        cues: 'Instructions how to do the move',
        styles: 'Capoeira, FlowAcrobatics', // analog to "genre"
        source: '#', // analog to "director"
        link: '#',
        featured: 'yes'
    },
    {
        title: 'pushup',
        cues: 'instructions how to do the move',
        styles: 'bodyweight strength', // analog to "genre"
        source: '#', // analog to "director"
        link: '#',
        featured: 'no'
    },
    {
        title: 'aerial',
        cues: 'instructions how to do the move',
        styles: 'tumbling', // analog to "genre"
        source: '#', // analog to "director"
        link: '#',
        featured: 'yes'
    }
];

let users = [];

const express = require('express'), 
    morgan = require('morgan'), // module for logging
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express(); // encapsulates Express’s functionality to configure your web server

app.use(morgan('common')); 
app.use(express.static('public')); // automatically route all files in the "public" folder
app.use(bodyParser.json());

// ROUTING

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
    res.json(topMoves.find((move) => { return move.name === req.params.name }));
});

// GET data about a style - NOT WORKING YET because database does not exist yet
app.get('/styles/:name', (req, res) => {
    res.send('Successful GET request returning data on the style: ' + req.params.name);
});

// GET data about a source - NOT WORKING YET because database does not exist yet
app.get('/sources/:name', (req, res) => {
    res.send('Successful GET request returning data on the source: ' + req.params.name);
});

// Register new user
app.post('/users', (req, res) => {
    let newUser = req.body;
    if (!newUser.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

// Update user data
app.put('/users/:name?:newName', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });

    if (user) {
        user.name = req.params.newName;
        res.status(201).send('Username ' + req.params.name + ' was changed to ' + req.params.newName);
    } else {
        res.status(404).send('Student with the name ' + req.params.name + ' was not found.');
    }
});

// Deregister a user
app.delete('/users/:name', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
    if (!user) {
        const message = 'Missing name in URL';
        res.status(400).send(message);
    } else {
        users.delete(user);
        res.status(201).send('Successful DELETE request to remove useraccount for ' + user);
    }
});

// Add move to favorite list
app.post('/users/:name/favorites', (req, res) => {
    let user = req.params.name;
    let newFavorite = req.body;
    
    // some "if..." needed to catch errors
    res.send('Successful POST request to add the move ' + newFavorite + ' to user account ' + user);
});

// Remove favorite from list
app.delete('/users/:name/favorites', (req, res) => {
    let user = req.params.name;
    let favorite = req.body;

    // some "if..." needed to catch errors
    res.send('Successful DELETE request to remove ' + favorite + ' from user account ' + user);
});



// handling for errors that have not be handled anywhere else
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});