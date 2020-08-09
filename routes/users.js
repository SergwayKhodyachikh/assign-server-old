const router = require('express').Router();
const User = require('../models/user');
const bodyValidation = require('../middleware/bodyValidation');
const {
  createUser,
  getCurrentUser,
  userLogin,
  authenticateGoogleOauth,
  oauthSuccessCallback,
} = require('../controllers/users');
const auth = require('../middleware/auth');
const passport = require('passport');

// register user
router.route('/').post(bodyValidation(User, 'create'), createUser);

router.route('/me').all(auth).get(getCurrentUser);
router.post('/login', bodyValidation(User, 'login'), userLogin);

// GOOGLE OAuth
router.get('/google', authenticateGoogleOauth);
router.get('/google/callback', authenticateGoogleOauth, oauthSuccessCallback);

// FACEBOOK OAuth
// router.get('/facebook', authenticateFacebookOauth);
// router.get('/facebook/callback', authenticateFacebookOauth, oauthSuccessCallback);

// Github Oauth
const githubAuth = passport.authenticate('github', { session: false });
router.get('/github', githubAuth);
router.get('/github/callback', githubAuth, oauthSuccessCallback);

module.exports = router;
