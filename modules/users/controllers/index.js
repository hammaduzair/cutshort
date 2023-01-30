const randtoken = require('rand-token');
const config = require('../../../config');

const { createUserInMongo, findUserInMongo } = require('../dals');
const {
    customError,
    sendError,
    sendOK
} = require("../../../helpers/common");

const { getJwtToken } = require('../../../auth/helper');
const { get } = require('lodash');

const createUser = async (req, res) => {
    const data = req.body;
    try {
        const user = await createUserInMongo(data);
        sendOK(res, { message: 'Success' });
    } catch (err) {
        console.error('ERROR | getGiftFinderResults | ', err);
        sendError(res, err);
    }
}

const loginUser = async (req, res) => {
    const data = req.body;
    const { email, password } = data;
    if (!(email && password)) {
        res.status(400).send("All input is required");
    }
    try {
        const user = await findUserInMongo(email);
        console.log(user)
        if (user.password == password) {
            const token = getJwtToken(user);
            const lastRefreshToken = get(user, 'refreshToken.value', randtoken.uid(256));
            const refreshToken = {
                value: lastRefreshToken,
                expiresAt: Math.floor(Date.now() / 1000) + config.jwtAuth.refreshExpiryInterval,
                isValid: true
            };
            sendOK(res, { token });
        } else {
            sendError(res, { message: 'Password does not match' });
        }

    } catch (err) {
        console.error('ERROR | getGiftFinderResults | ', err);
        sendError(res, err);
    }
}

const getUser = (req, res) => {
    console.log(req.user);
}

module.exports = {
    createUser,
    loginUser,
    getUser
}