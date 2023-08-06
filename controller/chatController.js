const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat');
const User = require('../models/user');
const { genPassword } = require('../utils/passwordUtils');

exports.index = asyncHandler(async (req, res, next) => {
  const allChats = await Chat.find({}).populate('user').exec();

  res.render('index', {
    title: 'Members Only',
    chats: allChats,
    loggedIn: req.isAuthenticated(),
    user: req.user,
  });
});

exports.signup_get = (req, res, next) => {
  res.render('signup', { title: 'Sign Up' });
};

exports.signup_post = [
  body('first_name', 'First Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Last Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('username', 'Username must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Password must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('passwordConf').custom((value, { req }) => {
    return req.body.passwordConf === req.body.password;
  }),
  body('passwordConf', 'Confirm Password must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('passwordConf', 'Confirm Password must match Password.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('signup', {
        title: 'Sign Up',
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        errors: errors.array(),
      });
    } else {
      const saltHash = genPassword(req.body.password);
      const { salt } = saltHash;
      const { hash } = saltHash;

      const user = new User({
        first_name: req.body.firstName,
        family_name: req.body.lastName,
        username: req.body.username,
        password: hash,
        salt,
        membership_status: true,
        admin_status: false,
      });

      await user.save();

      res.redirect('/');
    }
  }),
];

exports.login_get = (req, res, next) => {
  res.render('login', { title: 'Log In' });
};

exports.login_success = (req, res, next) => {
  res.redirect('/');
};

exports.login_failure = (req, res, next) => {
  res.render('login', {
    title: 'Log In',
    error: 'Invalid username or password.',
  });
};

exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};

exports.secret_get = (req, res, next) => {
  res.render('secret', { title: 'Secret Page' });
};

exports.secret_post = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).exec();

  if (req.body.secret === 'secret') {
    user.membership_status = true;
    user.save();
    res.redirect('/');
  } else {
    res.render('secret', {
      title: 'Secret Page',
      error: 'Incorrect secret.',
    });
  }
});

exports.newMessage_get = (req, res, next) => {
  res.render('newMessage', { title: 'New Message' });
};

exports.newMessage_post = asyncHandler(async (req, res, next) => {
  const chat = new Chat({
    user: req.user._id,
    message: req.body.message,
  });

  await chat.save();

  res.redirect('/');
});
