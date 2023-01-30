const { get } = require('lodash');

/**
 * Create custom error
 * @param {number} status Response status code
 * @param {string} message Response error message
 * @returns Error Object with custom status code and error message
 */
const customError = (status = 500, message = 'Something went wrong') => {
    let err = new Error(message);
    err.status = status;
    return err;
};

/**
 * Send error message in response to the request
 * @param {object} resp Response to the request
 * @param {object} err Error occured
 */
const sendError = (resp, err) => {
    if (err.isJoi === true) {
        err.status = 400;
    }
    const status = get(err, 'status') || 500;
    const message = get(err, 'message') || get(err, 'data.message') || 'Something went wrong';
    return resp.status(status).send({
        message
    });
};
/**
 * Sends HTTP success response
 * @param {object} resp HTTP response object
 * @param {*} message response message
 * @returns implementation of response.send
 */
const sendOK = (resp, message) => {
    return resp.send({
        message
    });
};

module.exports = {
    customError,
    sendError,
    sendOK
};
