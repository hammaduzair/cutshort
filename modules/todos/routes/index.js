const router = require("express").Router();

const { verifytoken } = require('../../../auth/helper');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../controllers');

router.route('/')
    .post(verifytoken, createTodo)

router.get('/:userId', getTodos)

router.route('/:id')
    .put(verifytoken, updateTodo)
    .delete(verifytoken, deleteTodo);

module.exports = router;
