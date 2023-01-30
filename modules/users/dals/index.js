const mongoose = require('mongoose');
const User = mongoose.model('User');

const createUserInMongo = (obj) => {    
    return User.create(obj);
}

const findUserInMongo = (email) => {
    return User.findOne({ email });
}

module.exports = {
    createUserInMongo,
    findUserInMongo
}