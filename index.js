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

const express = require('express'), 
    morgan = require('morgan');

const app = express(); // encapsulates Express’s functionality to configure your web server

app.use(morgan('common')); // module for logging
app.use(express.static('public')); // automatically route all files in the "public" folder

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to MoveX !');
});

/*
app.get('/documentation', (req, res) => {
    res.sendFile('/public/documentation.html', { root: __dirname });
});
*/

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