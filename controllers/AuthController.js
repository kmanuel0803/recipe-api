const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const { jwtSecret } = require('../config/config');
const { check, validationResult } = require('express-validator');

module.exports = {
    loginUesr: async (req, res) => {
        const { email, password } = req.body;
      
        try {
          const user = await UserModel.findOne({
            where: { email: email }
          });
      
          if (!user) {
            return res.status(401).json({
              status: false,
              error: 'Invalid email or password',
            });
          }
      
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(401).json({
              status: false,
              error: 'Invalid email or password',
            });
          }
      
          const token = jwt.sign(
            { id: user.id, email: user.email },
            jwtSecret,
            { expiresIn: '1h' }
          );
      
          res.status(200).json({
            status: true,
            user,
            token,
          });
        } catch (err) {
          res.status(500).json({
            status: false,
            error: err.message,
          });
        }
    },

    validateSignup: [
        check('password')
          .isLength({ min: 6 })
          .withMessage('Password must be at least 6 characters long'),
        check('confirm_password')
          .custom((value, { req }) => value === req.body.password)
          .withMessage('Passwords do not match'),
        (req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({
              status: false,
              errors: errors.array(),
            });
          }
          next();
        },
      ],
    registerUser:  async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            errors: errors.array(),
          });
        }
        const { name, email, password } = req.body;
      
        try {
          // Check if user already exists
          const existingUser = await UserModel.findOne({ where: { email: email } });
          if (existingUser) {
            return res.status(400).json({
              status: false,
              error: 'User already exists',
            });
          }
      
          const hashedPassword = await bcrypt.hash(password, 12);
          const newUser = await UserModel.create({ name, email, password: hashedPassword });
      
          res.status(201).json({
            status: true,
            data: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
            },
          });
        } catch (err) {
          res.status(500).json({
            status: false,
            error: err.message,
          });
        }
      }
}