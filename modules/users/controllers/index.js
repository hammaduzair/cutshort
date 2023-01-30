const randtoken = require('rand-token');
const config = require('../../../config');

const { createUserInMongo, findUserInMongo } = require('../dals');
const {
    customError,
    sendError,
    sendOK
} = require("../../../helpers/common");

const { getJwtToken } = require('../../../auth/helper');
const { registerSchema, loginSchema } = require('../validators');
const { get } = require('lodash');

const createUser = async (req, res) => {
    try {
        const data = await registerSchema.validateAsync(req.body);
        await createUserInMongo(data);
        sendOK(res, { message: 'Success' });
    } catch (err) {
        console.error('ERROR | getGiftFinderResults | ', err);
        sendError(res, err);
    }
}

const loginUser = async (req, res) => {
    try {
        const data = await loginSchema.validateAsync(req.body);
        const { email, password } = data;
        const user = await findUserInMongo(email);
        if (user.authenticate(password)) {
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

module.exports = {
    createUser,
    loginUser
}