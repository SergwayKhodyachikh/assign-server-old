const router = require('express').Router();
const _ = require('lodash');
const User = require('../models/user');
const bodyValidation = require('../middleware/bodyValidation');
const ServerError = require('../util/ServerError');
const { createUser } = require('../controllers/users');

router.route('/').post(bodyValidation(User, 'create'), createUser);

module.exports = router;
