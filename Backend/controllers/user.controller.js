const express = require('express')
const userService = require('../services/user.services')
const {validationResult} = require('express-validator')
const userModel = require('../models/user.model')
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.registerUser = async (req, res, next) =>{
     const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {fullname, email, password} = req.body
    const isUserAlreadyExists = await userModel.findOne({ email });
    if(isUserAlreadyExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashThePassword = await userModel.hashThePassword(password)

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashThePassword
    })
    if(!user){
        return res.status(400).json({message: "User registration failed"})
    }
    const token = user.generateAuthToken();
    res.status(200).json({token, user});
}


module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" }); // 👈 return added
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" }); // 👈 return added
  }

  const token = user.generateAuthToken();
  res.cookie('token', token);
  return res.status(200).json({ token, user });
};


module.exports.getUserProfile = async (req, res, next) => {
    
   return res.status(200).json(req.user);

}

module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");

    const tokenFromCookie = req.cookies?.token;
    const tokenFromHeader = req.headers?.authorization?.split(" ")[1];

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(400).json({ message: "Token not provided" });
    }

    await blackListTokenModel.create({ token });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err.message);
    return res.status(500).json({ message: "Logout failed", error: err.message });
  }
};
