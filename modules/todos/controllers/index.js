const {
    customError,
    sendError,
    sendOK
} = require("@helpers/common");

const {
    createNewTodoInMongo,
    getUserTodosFromMongo,
    getTodoFromMongo,
    updateTodoInMongo
} = require('../dals');

const {
    todoSchema
} = require('../validators');

const createTodo = async (req, res) => {
    const data = req.body;
    const { title } = data;
    const userId = req.user.id;
    try {
        if (!title) {
            customError(400, 'missing title')
        }
        const obj = {
            title,
            user: userId
        }
        await createNewTodoInMongo(obj);
        sendOK(res, { message: 'success' })
    } catch (err) {
        console.log('Error | CreateTodo ', err);
        sendError(res, err);
    }
}

const getTodos = async (req, res) => {
    const userId = req.params.userId;
    const page = req.query.page;
    const pageSize = req.query.pagesize;
    try {
        const todos = await getUserTodosFromMongo(userId, page, pageSize);
        sendOK(res, todos)
    } catch (err) {
        console.log('Error | CreateTodo ', err);
        sendError(res, err);
    }
}

const deleteTodo = async (req, res) => {
    const todoId = req.params.id;
    const userId = req.user.id;
    try {
        const todo = await getTodoFromMongo(todoId);
        if (todo.user != userId) {
            customError(403, 'Unauthorised')
        }
        const updateObj = {
            deleted: true
        }
        await updateTodoInMongo(todoId, updateObj);
        sendOK(res, { message: 'success ' });
    } catch (err) {
        console.log('Error | CreateTodo ', err);
        sendError(res, err);
    }
}

const updateTodo = async (req, res) => {
    const todoId = req.params.id;
    const userId = req.user.id;
    try {
        const data = await postSchema.validateAsync(req.body);
        const { title, completed } = data;
        const todo = await getTodoFromMongo(todoId);
        if (todo.user != userId) {
            customError(403, 'Unauthorised')
        }
        const updateObj = {
            ...title && { title },
            ...typeof completed == 'boolean' && { completed }
        }
        await updateTodoInMongo(todoId, updateObj);
        sendOK(res, { message: 'success ' });
    } catch (err) {
        console.log('Error | CreateTodo ', err);
        sendError(res, err);
    }
}


module.exports = {
    createTodo,
    getTodos,
    deleteTodo,
    updateTodo
}