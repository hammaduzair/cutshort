module.exports = {
    db: {
		uri: process.env.MONGODBURI,
		options: {
			connectTimeoutMS: 80000,
			socketTimeoutMS: 360000,
			w: "majority",
			wtimeout: 30000,
			j: true,
			readConcern: {
				"level": "local"
			},
			useUnifiedTopology: false,
			useNewUrlParser: true
		}
	},
    jwtAuth: {
		secret: 'ACEC9DF58517CCD9DFE563E31E478',
		issuer: 'Cutshort',
		audience: 'cutshort.io',
		expiryTime: 3,
		expiryTimeUnit: 'days',
		refreshExpiryInterval: 3 * 30 * 24 * 60 * 60,
		longExpiryTime: 90,
		longExpiryTimeUnit: 'd',
		shortExpiryTime: 30,
		shortExpiryTimeUnit: 'm'
	},
    redis: {
		host: "localhost",
		port: 6379
	},
    redisKey: {
        posts: 'posts:v1'
    },
    roles: ['user', 'admin']
}