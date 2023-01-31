const mongoose = require('mongoose');
const Todo = mongoose.model('Todo');

const createNewTodoInMongo = obj => {
    return Todo.create(obj);
}

const getUserTodosFromMongo = (userId, page = 1, pageSize = 5, search) => {
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    const queryObj = { user: userId, deleted: false };
    if (search) {
        queryObj.title = new RegExp(search, "i");
    }
    return Todo.find(queryObj)
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