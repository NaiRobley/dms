const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Kindly enter the username of the user'
    },
    password: {
        type: String,
        required: 'Kindly enter the password of the user'
    },
    email: {
        type: String,
        required: 'Kindly enter the email of the user'
    },
    bio: String,
    role: {
        type: String,
        default: 'public'
    },
    documents: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }]
});

userSchema.pre('save', function (next) {
    var user = this;

    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);
module.exports = User;
