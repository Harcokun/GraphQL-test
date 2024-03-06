const User = require("../../models/User");

const resolvers = {
  Mutation: {
    register: async (_, { name, email, password, retype, role }) => {
      try {

        if (password !== retype) {
          throw new Error("The retyped password doesn't match!");
        }

        // Create user
        const user = await User.create({
          name,
          email,
          password,
          role,
        });

        // Send token response
        const token = sendToken(user);

        return {
          success: true,
          message: "User registered successfully",
          token: token,
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },
    login: async (_, { email, password }) => {
      try {

        // Validate email & password
        if (!email || !password) {
          throw new Error("Please provide an email and password");
        }

        // Check for user
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        // Send token
        const token = sendToken(user);

        return {
          success: true,
          message: "User logged in successfully",
          token: token,
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },
    logout: async (_, __, context) => {
      try {
        context.res.cookie("token", "none", {
          expires: new Date(Date.now() + 10 * 1000),
          httpOnly: true,
        });

        return {
          success: true,
          message: "Successfully logged out",
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  Query: {
    getMe: async (_, __, context) => {
      try {
        // console.log(context.req.user);
        return context.req.user;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

// Function to create token, set cookie, and send response
const sendToken = (user) => {
  // Create token
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

  return token;
};

module.exports = resolvers;
