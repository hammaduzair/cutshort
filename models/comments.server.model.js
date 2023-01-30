const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config'); 

const CommentSchema = new Schema({
    post: {
        type: Schema.ObjectId,
		ref: 'Post'
    },
    user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    userName: {/* storing just to prevent populate when getting comments*/
        type: String,
        trim: true,
        default: ''
    },
    comment: {
        type: String,
        trim: true,
        default: ''
    }
});

CommentSchema.index({
    post: 1,
});

/**
 * Hook a pre save method to hash the password
 */

mongoose.model('Comment', CommentSchema);