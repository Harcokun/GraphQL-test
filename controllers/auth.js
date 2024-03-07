const User = require("../models/User");
const { saveCache, getCacheFromParams, removeCache } = require("../util/cache");

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, retype, role } = req.body;

    if (password !== retype) {
      return res.status(422).json({
        success: false,
        message: "The retyped password doesn't match!",
      });
    }

    //Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Save in Redis
    saveCache(user.id, user, res);

    //Create token
    //const token = user.getSignedJwtToken();
    //res.status(200).json({success: true, token});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
    console.log(err.stack);
  }
};

//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }

    //Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    //Create token
    //const token = user.getSignedJwtToken();
    //res.status(200).json({success: true, token});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({
      success: false,
      message: "Cannot convert email or password to string",
    });
  }
};

//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
  getCacheFromParams(req, res);
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

//@desc     Log user out / clear cookie
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  removeCache(req.user.id);

  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//   // Save in Redis cache
//   const saveCache = async (key, data, res) => {
//     const stringData = JSON.stringify(data);
//     // console.log(stringData);
  
//     redisClient.set(key, stringData, (err, reply) => {
//       if (err) {
//         console.error(err);
//         return res
//           .status(500)
//           .send("Error setting user in Redis after registraion");
//       }
//       // res.send("User data stored in Redis successfully");
//     });
//   };

//   const removeCache = async (key) => {
//     redisClient.del(key, (err, reply) => {
//         if (err) {
//             console.error('Error removing key from Redis:', err);
//         } else {
//             console.log('Key removed from Redis:', key);
//         }
//     });
// };