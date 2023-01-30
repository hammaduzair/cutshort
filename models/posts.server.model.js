const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config'); 

const PostSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    deleted: {
		type: Boolean,
		default: false
	},
});

PostSchema.index({
    title: 1,
});

/**
 * Hook a pre save method to hash the password
 */

mongoose.model('Post', PostSchema);