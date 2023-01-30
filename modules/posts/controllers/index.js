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
    console.log(req.isAdmin);
    const userId = req.user.id;
    const page = req.query.page;
    const pageSize = req.query.pagesize;
    const rediskey = `${config.redisKey.posts}:${page}:${pageSize}`;
    const posts = await writeAroundCache(rediskey, 100, false, getUserPostsFromMongo, userId, page, pageSize);
    sendOK(res, posts);
}

const getSinglePost = async (req, res) => {
    const postId = req.params.id;
    const page = req.query.page;
    const pageSize = req.query.pagesize;
    const response = await Promise.all([getPostFromMongo(postId), getPostCommentsFromMongo(postId, page, pageSize)]);
    const post = {
        ...response[0],
        comments: response[1]
    }
    sendOK(res, post);
}

const getPostComments = async (req, res) => {
    const postId = req.params.id;
    const page = req.query.page;
    const pageSize = req.query.pagesize;
    const comments = await getPostCommentsFromMongo(postId, page, pageSize);
    sendOK(res, comments);
}

const deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const post = await getPostFromMongo(postId);
        if (post.user != userId) {
            customError(403, 'Unauthorised')
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
        const data = await postSchema.validateAsync(req.body);
        const post = await getPostFromMongo(postId);
        if ((post.user != userId) && !req.isAdmin) {
            customError(403, 'Unauthorised')
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