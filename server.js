require('dotenv').config();
const mongoose = require('mongoose');
const redis = require("redis");
const config = require('./config');
const configC = require('./config/config');
const path = require('path');

console.log(process.env);
const port = process.env.PORT;

console.log("MongoDB Config :", config.db);

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open and connected to ' + config.db.uri);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

mongoose.connection.on('error', function(err) {
  console.log(config.db.uri);
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  }
);
mongoose.Promise = global.Promise;
mongoose.connect(config.db.uri, config.db.options);
mongoose.plugin(schema => { schema.options.usePushEach = true });

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();


const app = require('./config/express')(mongoose);


configC.getGlobbedFiles('./routes/**/*.js').forEach(function (routePath) {
  require(path.resolve(routePath))(app);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})