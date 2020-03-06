const express = require('express');

const router = express.Router();
const { validateAdmin } = require('../../middleware/auth');

const studentRouter = require('./student');
const subjectRouter = require('./subject');
const shiftRouter = require('./shift');
const roomRouter = require('./room');
const semesterRouter = require('./semester');

const { Users } = require('../../models/sequelize');


router.use('/admin', studentRouter);
router.use('/admin', subjectRouter);
router.use('/admin', shiftRouter);
router.use('/admin', roomRouter);
router.use('/admin', semesterRouter);

module.exports = router;
