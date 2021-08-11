const express = require('express'), 
    morgan = require('morgan');

const app = express(); // encapsulates Express’s functionality to configure your web server

app.use(morgan('common')); // module for logging

let topMoves = [
    {
        title: 'Macaco',
        category: 'capoeira'
    },
    {
        title: 'pushup',
        category: 'bodyweight stregth'
    },
    {
        title: 'aerial',
        category: 'tumbling'
    }
];

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to MoveX !');
});

app.get('/documentation', (req, res) => {
    res.sendFile('documentation.html', { root: __dirname });
});

app.get('/moves', (req, res) => {
    res.json(topMoves);
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