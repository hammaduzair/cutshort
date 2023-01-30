const jwt = require('jsonwebtoken');
const config = require('../config');
const { sendError, customError } = require('../helpers/common');
const { get } = require('lodash');

const getJwtToken = (user) => {
    const token = jwt.sign({
            sub: user.email,
            data: {
                roles: user.roles,
                id: user._id,
                email: user.email
            },
            iat: Math.floor(Date.now() / 1000),
        }, config.jwtAuth.secret,
        {
            expiresIn: `${config.jwtAuth.expiryTime} ${config.jwtAuth.expiryTimeUnit}`,
            audience: config.jwtAuth.audience,
            issuer: config.jwtAuth.issuer
        }
    );
    return token;
};

const verifytoken = (req, res, next) => {
    const token = (get(req, 'headers.authorization') || '').substring(7);
    try {
        const verify = jwt.verify(token, config.jwtAuth.secret);
        if(verify) {
            req.user = (verify.data);
            next()
        }
    } catch (e) {
        console.error(`Error decoding token:`, e);
        next(e);
    }
}

module.exports = {
    getJwtToken,
    verifytoken
}