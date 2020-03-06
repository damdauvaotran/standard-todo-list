const express = require('express');

const router = express.Router();
const authRouter = require('./auth');
const adminRouter = require('./admin');
const studentRouter = require('./student.js');

router.use('/', authRouter);
router.use('/', adminRouter);
router.use('/', studentRouter);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
