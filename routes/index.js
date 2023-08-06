const express = require('express');
const chatController = require('../controller/chatController');
const passport = require('passport');

const router = express.Router();

/* GET home page. */
router.get('/', chatController.index);
router.get('/signup', chatController.signup_get);
router.post('/signup', chatController.signup_post);
router.get('/login', chatController.login_get);
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: 'login-success',
  })
);
router.get('/login-success', chatController.login_success);
router.get('/login-failure', chatController.login_failure);
router.get('/logout', chatController.logout);
router.get('/secret', chatController.secret_get);
router.post('/secret', chatController.secret_post);
router.get('/newMessage', chatController.newMessage_get);
router.post('/newMessage', chatController.newMessage_post);

module.exports = router;
