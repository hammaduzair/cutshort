const router = require("express").Router();

const { verifytoken, checkIfAdmin } = require('../../../auth/helper');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../controllers');

router.route('/')
    .post(verifytoken, createTodo)

router.get('/:userId', getTodos)

router.route('/:id')
    .put(verifytoken, checkIfAdmin, updateTodo)
    .delete(verifytoken, checkIfAdmin, deleteTodo);

module.exports = router;
