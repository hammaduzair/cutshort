const mongoose = require('mongoose');
const Todo = mongoose.model('Todo');

const createNewTodoInMongo = obj => {
    return Todo.create(obj);
}

const getUserTodosFromMongo = (userId, page = 1, pageSize = 5) => {
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    return Todo.find({ user: userId, deleted: false })
        .skip(skip)
        .limit(limit);
}

const getTodoFromMongo = todoId => {
    return Todo.findOne({ _id: todoId });
}

const updateTodoInMongo = (todoId, obj) => {
    return Todo.updateOne({ _id: todoId }, { $set: obj });
}

module.exports = {
    createNewTodoInMongo,
    getUserTodosFromMongo,
    getTodoFromMongo,
    updateTodoInMongo
}