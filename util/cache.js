const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

// Save in Redis cache
const saveCache = async (key, data, res) => {
  const stringData = JSON.stringify(data);
  // console.log(stringData);

  redisClient.set(key, stringData, (err, reply) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send("Error setting user in Redis after registraion");
    }
    // res.send("User data stored in Redis successfully");
    redisClient.expire(key, process.env.CACHE_EXPIRE, (err, reply) => {
      if (err) {
        console.error(err);
      } else {
        console.log(
          `TTL set for key ${key}: ${process.env.CACHE_EXPIRE} seconds`
        );
      }
    });
  });
};

// Middleware to check if data is cached in Redis
const getCacheFromParams = async (req) => {
  const urlParts = req.originalUrl.split("/");
  const key = urlParts[urlParts.length - 1]; // Use the request param as the cache key
  console.log(`User cache found`);
  // console.log(`Key: ${key}`);
  const data = await redisClient.get(key);
  if (data !== null) {
    // If data exists in cache, send it back
    console.log("Data found in cache");
    return JSON.parse(data);
    // res.send({ success: true, data: JSON.parse(data) });
  } else {
    return null;
  }
};

const updateCache = async (key, newData) => {
  // Check if the key exists in the cache
  const data = redisClient.get(key);

  // If data exists in cache, update it with new data
  if (data !== null) {
    const stringData = JSON.stringify(newData);
    redisClient.set(key, stringData, (err, reply) => {
      if (err) {
        console.error("Error updating cache: ", err);
      }
      console.log("Cache updated for key:", key);
    });
  } else {
    // If data doesn't exist in cache, insert the new data
    const stringData = JSON.stringify(newData);
    redisClient.set(key, stringData, (err, reply) => {
      if (err) {
        console.error("Error updating cache: ", err);
      }
      redisClient.expire(key, process.env.CACHE_EXPIRE, (err, reply) => {
        if (err) {
          console.error(err);
        } else {
          console.log(
            `TTL set for key ${key}: ${process.env.CACHE_EXPIRE} seconds`
          );
        }
      });
      console.log("New data inserted into cache for key:", key);
    });
  }
};

const removeCache = async (key) => {
  redisClient.del(key, (err, reply) => {
    if (err) {
      console.error("Error removing key from Redis:", err);
    } else {
      console.log("Key removed from Redis:", key);
    }
  });
};

// Export the function instead of the client itself
module.exports = {
  redisClient,
  saveCache,
  getCacheFromParams,
  updateCache,
  removeCache,
};
