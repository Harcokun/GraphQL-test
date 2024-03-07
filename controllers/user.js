const User = require("../models/User");
const { saveCache, getCacheFromParams, updateCache, removeCache } = require("../util/cache");

exports.getUser = async (req, res, next) => {
  const data = await getCacheFromParams(req);
  if (data !== null) {
    res.status(200).json({ success: true, data: data });
  } else {
    const user = await User.findById(req.params.id);
    console.log(`Reached getUser controller`);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${req.params.id}`,
        data: null,
      });
    }

    // Save in Redis
    saveCache(user.id, user, res);

    res.status(200).json({ success: true, data: user });
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;

    //Create user
    const user = await User.create({
      name,
      email,
      role,
      password,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
    console.log(err.stack);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${req.params.id}`,
      });
    }

    //Make sure that user has right to update
    if (user.id !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.name} is not authorized to update this user`,
      });
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    updateCache(user.id, user);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot update user",
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${req.params.id}`,
      });
    }

    //Make sure that user has right to delete
    if (user.id !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this user`,
      });
    }

    await User.deleteOne({ _id: req.params.id });

    removeCache(req.params.id);

    res.status(204).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete user",
    });
  }
};
