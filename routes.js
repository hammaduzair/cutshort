const { createUser, loginUser } = require('./modules/users/controllers');

module.exports = function (app) {
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.post('/user', createUser);

    app.post('/login', loginUser)

    app.use('/posts', require('./modules/posts/routes'));
    app.use('/todos', require('./modules/todos/routes'));
}
