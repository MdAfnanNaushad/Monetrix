const userModel = require('../models/userModel')
const momgoose = require('mongoose')
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.finOne({
            email, password
        })
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            error,
        })
    }
}

const registerController = async (req, res) => {
    try {
        const newUser = new userModel.create(req.body);
        await newUser.save();
        res.staus(201).json({
            success: true,
            newUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error,
        })
    }
}

module.exports = { loginController, registerController } //bcz of multiple exports