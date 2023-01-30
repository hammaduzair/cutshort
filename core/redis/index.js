const redis = require("ioredis");
const config = require('../../config');
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

/* gets value from redis if exists, otherwise it performs the operation provided and sets the value returned in cache
    expected params:
    cacheKey(string): redis key,
    ttl(number): key time to live,
    rebuildCache(boolean): if true get data from operations instead of cache and update cache,
    operations(function): functions to be called if no cache value exists for given key,
    args(separate keys): no/single/mutiple values that will be passed as params in the operations function

    ex: writeAroundCache(rediskey, 100, false, getUserPostsFromMongo, userId, page, pageSize) -> will perform getUserPostsFromMongo(userId, page, pageSize) if no cache value exists
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