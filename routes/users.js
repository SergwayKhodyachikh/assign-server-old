const router = require('express').Router();
const User = require('../models/user');
const bodyValidation = require('../middleware/bodyValidation');
const {
  createUser,
  getCurrentUser,
  userLogin,
  authenticateGoogleOauth,
  redirectOnOauthSuccess,
  logoutUser,
  authenticateFacebookOauth,
} = require('../controllers/users');
const auth = require('../middleware/auth');

// register user
router.route('/').post(bodyValidation(User, 'create'), createUser);

router.route('/me').all(auth).get(getCurrentUser);
router.post('/login', bodyValidation(User, 'login'), userLogin);
router.get('/logout', logoutUser);

// GOOGLE OAuth
router.get('/google', authenticateGoogleOauth);
router.get('/google/callback', authenticateGoogleOauth, redirectOnOauthSuccess);

// FACEBOOK OAuth
router.get('/facebook', authenticateFacebookOauth);
router.get('/facebook/callback', authenticateFacebookOauth, redirectOnOauthSuccess);

module.exports = router;
