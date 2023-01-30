const router = require("express").Router();

const { verifytoken, checkIfAdmin } = require('../../../auth/helper');
const { createUserPosts,
    getUserPosts,
    getSinglePost,
    getPostComments,
    updatePost,
    deletePost,
    addCommentToPost } = require('../controllers');

router.route('/')
    .get(verifytoken, getUserPosts)
    .post(verifytoken, createUserPosts)

router.route('/:id')
    .get(getSinglePost)
    .put(verifytoken, checkIfAdmin, updatePost)
    .delete(verifytoken, deletePost)

router.route('/comments/:id')
    .get(getPostComments)

router.route('/comment')
    .post(verifytoken, addCommentToPost)

module.exports = router;