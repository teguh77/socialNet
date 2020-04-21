const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//@route   POST /api/profile
//@desc    Create or update user profile
//@access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required')
        .not()
        .isEmpty(),
      check('skills', 'skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    } = req.body;

    //Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (status) profileFields.status = status;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({user: req.user.id});
      //karena user = objectId maka sama dengan req.user.id (yang berasal darai token);

      //Update jika file ditemukan
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          {user: req.user.id},
          {$set: profileFields},
          {new: true}
        );
        return res.json(profile);
      }

      //Create jika tidak ditmukan profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(400).send('Server error');
    }
  }
);

//@route   GET /api/profile/me
//@desc    Get profile for current User
//@access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({msg: 'There is no profile for this user'});
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   GET /api/profile
//@desc    Get all profile users
//@access  Private
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});

//@route   GET /api/profile/user/user_id
//@desc    Find profile by user ID
//@access  Private
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({msg: 'Profile not found'});
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({msg: 'Profile not found'});
    }
    res.status(400).send('Server Error');
  }
});

//@route   DELETE /api/profile
//@desc    DELETE current user
//@access  Private
router.delete('/', auth, async (req, res) => {
  try {
    //@todo -remove users posts
    await Post.deleteMany({user: req.user.id});

    //Remove profile
    await Profile.findOneAndRemove({user: req.user.id});

    //Remove user
    await User.findOneAndRemove({_id: req.user.id});

    res.json({msg: 'User Deleted'});
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});

//Byme
//@route   DELETE /api/profile
//@desc    DELETE profile by ID
//@access  Private
router.delete('/:user_id', async (req, res) => {
  try {
    //@todo -remove users posts

    await Profile.findOneAndRemove({
      _id: req.params.user_id
    });

    res.json({msg: 'Profile Deleted'});
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});

//@route   PUT  /api/experience
//@desc    Add profile experience
//@access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is required')
        .not()
        .isEmpty(),
      check('company', 'company is required')
        .not()
        .isEmpty(),
      check('from', 'from date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({errors: errors.array()});
    }

    const {title, company, location, from, to, current, description} = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({user: req.user.id});

      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(400).send('server error');
    }
  }
);

//@route   DELETE /api/profile/experience/:exp_id
//@desc    Delete experience from profile
//@access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server error');
  }
});

//@route   PUT  /api/profile/education
//@desc    Add profile education
//@access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required')
        .not()
        .isEmpty(),
      check('degree', 'degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'from date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({errors: errors.array()});
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({user: req.user.id});

      profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(400).send('server error');
    }
  }
);

//@route   DELETE /api/profile/education/:edu_id
//@desc    Delete education from profile
//@access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server error');
  }
});

//@route   GET /api/profile/github/:username
//@desc    Get user repos from github
//@access  Public
//@step    => Create auth in github setting profile
//         =>  Copy client id & client secret and paste in db.js

router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`
    };

    const gitHubResponse = await axios.get(uri, {headers});
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({msg: 'No Github profile found'});
  }
});

module.exports = router;
