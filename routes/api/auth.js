const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');

//@route   GET /api/auth
//@desc    Get current user
//@access  private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({user});
  } catch (err) {
    console.log(err.message);
    res.send(500).json('Server Error');
  }
});

//@route   GET /api/auth
//@desc    Login users
//@access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid Email').isEmail(),
    check('password', 'Password is required!').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    //Define req.body
    const {email, password} = req.body;

    try {
      //Check existing User
      let user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials!'}]});
      }

      //Compare Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials!'}]});
      }

      //Define payload for JWT
      const payload = {
        user: {
          id: user.id // karena menggunakan mongoose maka id tidak perlu ditulis dengan _id yang sebenernya _id dari mongodb
        }
      };
      //Sign JWT
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 360000},
        (err, token) => {
          if (err) throw err;
          return res.json({token});
        }
      );
    } catch (err) {
      res.status(500).json({errors: [{msg: 'Server Error'}]});
    }
  }
);

module.exports = router;
