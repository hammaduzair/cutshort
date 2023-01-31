const jwt = require('jsonwebtoken');
const config = require('@config');
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
        if (verify) {
            const user = verify.data;
            console.log(user)
            req.user = user;
            req.isAdmin = (user.roles || []).includes('admin');
            next()
        }
    } catch (e) {
        console.error(`Error decoding token:`, e);
        res.status(401).jsonp({ message: "Unauthorized" });
    }
}

module.exports = {
    getJwtToken,
    verifytoken
}