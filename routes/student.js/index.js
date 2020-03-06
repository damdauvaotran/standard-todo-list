const router = require('express').Router();

const subjectRouter = require('./subject');
const shiftRouter = require('./shift');

router.use('/student', subjectRouter);
router.use('/student', shiftRouter);


module.exports = router;
