const redis = require("ioredis");
const config = require('../../config');
const redisClient = new redis(config.redis);

const getCachedStringByKey = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, function (err, reply) {
            if (err)
                return reject(err);
            else if (reply) {
                return resolve(JSON.parse(reply));
            } else {
                return resolve();
            }
        });
    });
};

const setCacheStringByKey = (key, object, ttl = 100) => {
    return new Promise((resolve, reject) => {
        const string = JSON.stringify(object);
        redisClient.set(key, string)
            .then(res => redisClient.expire(key, ttl).then(resolve, reject), reject);
    });
};

const writeAroundCache = async (cacheKey, ttl, rebuildCache, operations, ...args) => {
    let response = await getCachedStringByKey(cacheKey);
    if (!response || rebuildCache) {
        if (args.length > 0) {
            response = await operations(...args);
        } else {
            response = await operations();
        }
        await setCacheStringByKey(cacheKey, response, ttl);
    }
    return response;
};

module.exports = {
    getCachedStringByKey,
    setCacheStringByKey,
    writeAroundCache
}