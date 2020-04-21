const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const normalize = require('normalize-url');
const {check, validationResult} = require('express-validator');

//Init User Model
const User = require('../../models/User');

//@route   POST/api/users
//@desc    Create users
//@access  Public
router.post(
  '/',
  [
    check('name', 'Name is Required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid Email').isEmail(),
    check(
      'password',
      'Please enter a Password with 6 or more characters'
    ).isLength({min: 6})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    //Define req.body
    const {name, email, password} = req.body;

    try {
      //Check existing User
      let user = await User.findOne({email});
      if (user) {
        return res.status(400).json({errors: [{msg: 'User already exist!'}]});
      }

      //Gravatar
      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        {forceHttps: true}
      );
      //Init User to Model
      user = new User({
        name,
        email,
        password,
        avatar
      });

      //Salt % Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

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
