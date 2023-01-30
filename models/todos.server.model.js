const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    completed: {
		type: Boolean,
        default: false
	},
    user: {
        type: Schema.ObjectId,
		ref: 'User'
    },
    deleted: { /*instead of deleting a todo we mark it as deleted for logging purposr */
        type: Boolean,
        default: false
    }
});

TodoSchema.index({
    user: 1,
});

mongoose.model('Todo', TodoSchema);