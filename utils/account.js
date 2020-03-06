const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models/sequelize');
const { role } = require('../constant');

const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;
const jwtPrivateKey = process.env.PRIVATE_KEY_JWT || '!bE8JX7!owd!W67&XEU9kw2W';

const createStudentAccount = async (username, password, name, mssv) => {
  try {
    const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds, 10));
    const createdStudent = await Users.create({
      username,
      password: hashedPassword,
      name,
      mssv,
      role: role.STUDENT,
    });
    return createdStudent;
  } catch (e) {
    console.error(e);
  }
};

const getUserId = (token) => {
  console.log('token', token);
  const decodedData = jwt.verify(token, jwtPrivateKey);

  const { id } = decodedData;
  return id;
};


module.exports = {
  createStudentAccount,
  getUserId,
};
