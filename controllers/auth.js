const User = require("../models/User");
const mongoose = require('mongoose');

exports.getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
};

exports.getUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
};

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
    
        //Create user
        const user = await User.create({
          name,
          email,
          password
        });

        res.status(200).json({
            success: true,
            data: user
        });
    
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(err.stack);
      }
};

exports.updateUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: `No user with the id of ${req.params.id}`
            });
        }

        user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot update user'
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `No user with the id of ${req.params.id}`
            });
        }

        await User.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot delete user'
        });
    }
}
