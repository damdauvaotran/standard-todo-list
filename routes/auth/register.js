const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const { Users } = require('../../models/sequelize');
const { role } = require('../../constant');

const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;

router.post('/register', async (req, res) => {
  const {
    username, password, name, city, mssv, country,
  } = req.body;
  try {
    const duplicatedUser = await Users.findOne({ where: { username } });
    if (!duplicatedUser) {
      const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds, 10));
      const createdUser = await Users.create({
        username,
        password: hashedPassword,
        name,
        mssv,
        city,
        role: role.STUDENT,
        country,
      });
      res.json({
        success: true,
        data: {
          createdUser,
        },
      });
    } else {
      res.json({
        success: false,
        data: null,
        message: {
          vi: 'Tên đăng nhập đã tồn tại',
        },
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
});


module.exports = router;
