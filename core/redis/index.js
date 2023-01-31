const redis = require("ioredis");
const config = require('@config');
const redisClient = new redis(config.redis);

/* get redis key value if exists */
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

/* sets redis key value */
const setCacheStringByKey = (key, object, ttl = 100) => {
    return new Promise((resolve, reject) => {
        const string = JSON.stringify(object);
        redisClient.set(key, string)
            .then(res => redisClient.expire(key, ttl).then(resolve, reject), reject);
    });
};

/**
 * Send error message in response to the request
 * @param {string} cacheKey redis key
 * @param {number} ttl time to live
 * @param {boolean} rebuildCache if true, get data from operations instead of cache and update cache,
 * @param {function} operations  function to be called if no cache value exists for given key,
 * @param {number} ttl time to live
 * @param args no/single/mutiple values that will be passed as params in the operations function
 * @returns value from cache if it exists, otherwise fetch data from operations and set it cache and return value
 * ex: writeAroundCache(rediskey, 100, false, getUserPostsFromMongo, userId, page, pageSize) -> will perform getUserPostsFromMongo(userId, page, pageSize) if no cache value exists
 */
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