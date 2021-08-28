const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // to hash user passwords

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

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) { // can't be an arrow function because that would bind "this.password" to userSchema.methods instead of the user it is called on
    return bcrypt.compareSync(password, this.Password);
};

let Move = mongoose.model('Move', moveSchema); // will come out as "db.moves"
let User = mongoose.model('User', userSchema);

module.exports.Move = Move;
module.exports.User = User;