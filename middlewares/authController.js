const User = require('../models/userModel');
const HttpError = require('../utils/httpError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const getUsers = async (req, res, next) => {

    // let users;
  //   try {
  //       users = await User.find({}, '-password');
  //   } catch (err) {
       
  // }

  //   res
  //   .status(201)
  //   .json({ users });
  res.status(200).json({ name: 'john' });

};

const signup = async (req, res, next) => {


    const { name, email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (existingUser) {
      const error = new HttpError(
        'User exists already, please login instead.',
        422
      );
      return next(error);
    }
  
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        'Could not create user, please try again.',
        500
      );
      return next(error);
    }
  
    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
    });
  
    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  
    let token;
    try {
      token = jwt.sign(
        {   userId: createdUser.id, 
            email: createdUser.email,
            role: createdUser.role
        },
        'supersecret_dont_share',
        { expiresIn: '1h' }
      );
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  
    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token, role: createdUser.role });



  
};

const login = async (req, res, next) => {

  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, role: existingUser.role },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    role: existingUser.role
  });

};


const checkAuth = async (req, res, next) => {

    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            return next(
                new HttpError('Authentication failed!', 403)
            );
        }
        const decodedToken = jwt.verify(token, 'supersecret_dont_share');

          //  Check if user still exists
        const currentUser = await User.findById(decodedToken.userId);
        if (!currentUser) {
            return next(
                new HttpError('The user belonging to this token does no longer exist.', 401)
            );
        }

        console.log("currentUser", currentUser.role);
        // console.log(decodedToken);
        req.user = currentUser;
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed!', 403);
        return next(error);
    }

}

const adminCheck = (req, res, next) => {

    const { role } = req.user;
  
    if (role !== "admin") {
      res.status(403).json({
        err: "Admin resource. Access denied.",
      });
    } else {
      next();
    }

}








exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.checkAuth = checkAuth;
exports.adminCheck = adminCheck;
