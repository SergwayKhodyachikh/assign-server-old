const router = require('express').Router();
const _ = require('lodash');
const User = require('../models/user');
const bodyValidation = require('../middleware/bodyValidation');
const ServerError = require('../util/ServerError');
const { createUser, getCurrentUser, userLogin } = require('../controllers/users');
const auth = require('../middleware/auth');

router.route('/').post(bodyValidation(User, 'create'), createUser);

router.route('/me').all(auth).get(getCurrentUser);

router.post('/login', userLogin);

module.exports = router;
