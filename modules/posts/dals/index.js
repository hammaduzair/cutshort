const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const createUserPostsinMongo = obj => {
    return Post.create(obj);
}

const getUserPostsFromMongo = (userId, page = 1, pageSize = 5) => {
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    return Post.find({ user: userId, deleted: false })
        .skip(skip)
        .limit(limit);
}

const getPostFromMongo = postId => {
    return Post.findOne({ _id: postId });
}

const getPostCommentsFromMongo = (postId, page = 1, pageSize = 5) => {
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    return Comment.find({ post: postId })
        .skip(skip)
        .limit(limit);
}

const createPostCommentinMongo = obj => {
    return Comment.create(obj);
}

const updatePostInMongo = (postId, obj) => {
    return Post.updateOne({ _id: postId }, { $set: obj });
}

module.exports = {
    createUserPostsinMongo,
    getUserPostsFromMongo,
    getPostFromMongo,
    updatePostInMongo,
    getPostCommentsFromMongo,
    createPostCommentinMongo
}