const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { Users } = require('../../models/sequelize');

const jwtPrivateKey = process.env.PRIVATE_KEY_JWT || '!bE8JX7!owd!W67&XEU9kw2W';

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    try {
      const user = await Users.findOne({ where: { username } });
      if (user !== null) {
        const truePassword = user.password;
        const isPasswordCorrect = await bcrypt.compare(password, truePassword);
        if (isPasswordCorrect) {
          const token = jwt.sign({ username, id: user.userId, r: user.role }, jwtPrivateKey, { expiresIn: 8640000 }); // 100 days
          res.json({
            success: true,
            data: {
              token,
            },
          });
        } else {
          res.json({
            success: false,
            message: 'Your username or password not correct. Please try again',
          });
        }
      } else {
        res.json({
          success: false,
          message: 'Your username or password not correct. Please try again',
        });
      }
    } catch (e) {
      res.json({
        success: false,
        data: null,
        message: {
          error: e,
        },
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Your request is not valid',
    });
  }
});

module.exports = router;
