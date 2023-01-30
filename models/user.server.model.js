const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const config = require('@config');

const UserSchema = new Schema({
    email: {
        type: String,
        unique: "Email already exists",
        trim: true,
        required: 'Please fill in a email',
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            default: null
        },
        suite: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        zipcode: {
            type: String,
            default: null
        },
        geo: {
            lat: {
                type: Number,
                default: null
            },
            long: {
                type: Number,
                default: null
            },

        }
    },
    company: {
        name: {
            type: String,
            default: null
        },
        catchPhrase: {
            type: String,
            default: null
        },
        bs: {
            type: String,
            default: null
        }
    },
    phone: {
        type: String
    },
    website: {
        type: String
    },
    salt: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: config.roles
        }],
        default: ['user']
    },
});

UserSchema.index({
    email: 1,
});

/**
 * Hook a pre save method to hash the password
 */

UserSchema.pre(
    'save',
    function (next) {
        const user = this;;
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password, this.salt);
        next();
    }
);

UserSchema.methods.hashPassword = function (password, salt) {
    const pwdSalt = salt || this.salt;
    if (pwdSalt && password) {
        const hashedPassword = crypto.pbkdf2Sync(password, new Buffer(pwdSalt, 'base64'), 10000, 64, 'sha1').toString('base64');
        return hashedPassword;
    } else {
        return password;
    }
};

UserSchema.methods.authenticate = function (password) {
    const hashedPassword = this.hashPassword(password);
    return hashedPassword == this.password;
};

mongoose.model('User', UserSchema);