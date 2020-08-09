const router = require('express').Router();
const User = require('../models/user');
const bodyValidation = require('../middleware/bodyValidation');

const {
  createUser,
  getCurrentUser,
  userLogin,
  authenticateGoogleOauth,
  oauthSuccessCallback,
  authenticateGithubOauth,
} = require('../controllers/users');
const auth = require('../middleware/auth');

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
router.get('/github', authenticateGithubOauth);
router.get('/github/callback', authenticateGithubOauth, oauthSuccessCallback);

module.exports = router;
