const express = require('express');

const router = express.Router();
const loginRouter = require('./login');
const registerRouter = require('./register');

const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;

router.use('/auth', loginRouter);
router.use('/auth', registerRouter);

module.exports = router;
