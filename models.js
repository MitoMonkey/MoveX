const mongoose = require('mongoose');

let moveSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Cues: {type: String, required: true},
    Style: {
        Name: String,
        Description: String
    },
    Source: {
        Name: String,
        Weblink: String
    },
    // References: [String],
    VideoURL: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMoves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Move' // singular “Move” because that is the name of the model which links the moveSchema to its database collection
    }]
});

let Move = mongoose.model('Move', moveSchema); // will come out as "db.moves"
let User = mongoose.model('User', userSchema);

module.exports.Move = Move;
module.exports.User = User;