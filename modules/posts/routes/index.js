const router = require("express").Router();

const { verifytoken } = require('../../../auth/helper');
const { createUserPosts, getUserPosts, getSinglePost, updatePost, deletePost, addCommentToPost } = require('../controllers');

router.route('/')
    .get(verifytoken, getUserPosts)
    .post(verifytoken, createUserPosts)

router.route('/:id')
    .get(getSinglePost)
    .put(verifytoken, updatePost)
    .delete(verifytoken, deletePost)

router.route('/comment')
    .post(verifytoken, addCommentToPost)

module.exports = router;