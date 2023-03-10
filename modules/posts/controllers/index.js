const { getUserPostsFromMongo, 
        createUserPostsinMongo, 
        getPostFromMongo,
        getPostCommentsFromMongo,
        updatePostInMongo,
        createPostCommentinMongo } = require('../dals');

const {
    customError,
    sendError,
    sendOK
} = require("@helpers/common");

const { writeAroundCache } = require('@core/redis');

const {
    postSchema,
    commentSchema
} = require('../validators');

const config = require('@config');

const createUserPosts = async (req, res) => {
    try {
        const data = await postSchema.validateAsync(req.body);
        const post = {
            title: data.title,
            description: data.description,
            user: req.user.id
        }
        await createUserPostsinMongo(post);
        sendOK(res, { message: 'success' });
    } catch (err) {
        console.error('ERROR | createUserPosts | ', err);
        sendError(res, err);
    }
    
}

const getUserPosts = async (req, res) => {
    const userId = req.user.id;
    const { page, pagesize } = req.query;
    const rediskey = `${config.redisKey.posts}:${userId}:${page}:${pagesize}`;
    const posts = await writeAroundCache(rediskey, 100, false, getUserPostsFromMongo, userId, page, pagesize);
    sendOK(res, posts);
}

const getSinglePost = async (req, res) => {
    const postId = req.params.id;
    const post = await getPostFromMongo(postId);
    sendOK(res, post);
}

const getPostComments = async (req, res) => {
    const postId = req.params.id;
    const { page, pagesize } = req.query;
    const comments = await getPostCommentsFromMongo(postId, page, pagesize);
    sendOK(res, comments);
}

const deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const post = await getPostFromMongo(postId);
        if (!req.isAdmin && post.user != userId) {
            throw customError(403, 'Unauthorised')
        }
        const updateObj = {
            deleted: true
        }
        await updatePostInMongo(postId, updateObj);
        sendOK(res, { message: 'success ' });
    } catch (err) {
        console.log('Error | deletePost ', err);
        sendError(res, err);
    }
}

const updatePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const data = req.body;
        const post = await getPostFromMongo(postId);
        if (!req.isAdmin && (post.user != userId)) {
            throw customError(403, 'Unauthorised')
        }
        const { title, description } = data;
        const updateObj = {
            ...title && { title },
            ...description && { description }
        }
        await updatePostInMongo(postId, updateObj);
        sendOK(res, { message: 'success ' });
    } catch (err) {
        console.log('Error | updatePost ', err);
        sendError(res, err);
    }
}

const addCommentToPost = async (req, res) => {
    try {
        const data = await commentSchema.validateAsync(req.body);
        const { comment, postId } = data;
        const userId = req.user.id;
        const obj = {
            user: userId,
            comment,
            post: postId
        }
        await createPostCommentinMongo(obj);
        sendOK(res, { message: 'success' });
    } catch (err) {
        console.log('Error | addCommentToPost ', err);
        sendError(res, err);
    }
}

module.exports = {
    createUserPosts,
    getUserPosts,
    getSinglePost,
    getPostComments,
    deletePost,
    updatePost,
    addCommentToPost
}