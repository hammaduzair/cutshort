const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../config');

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
    async function (next) {
        const user = this;
        this.salt = await bcrypt.genSalt(10);
        this.password = await this.hashPassword(this.password);

        next();
    }
);

UserSchema.methods.hashPassword = async (password) => {
    if (this.salt && password) {
        return await bcrypt.hash(this.password, salt);
    } else {
        return password;
    }
};

UserSchema.methods.authenticate = async (password) => {
    return this.password === await this.hashPassword(password);
};

mongoose.model('User', UserSchema);