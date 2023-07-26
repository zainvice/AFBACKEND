const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/Token.model");
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const signup = async (data) => {
 
};

const requestPasswordReset = async (email) => {
  
};

const resetPassword = async (userId, token, password) => {
  
};

module.exports = {
  signup,
  requestPasswordReset,
  resetPassword,
};
