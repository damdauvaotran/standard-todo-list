const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');

const router = express.Router();
const { Op } = require('sequelize');

const upload = multer();

const { validateAdmin, validateStudent } = require('../../middleware/auth');
const { Users } = require('../../models/sequelize');
const { role, wsSchema } = require('../../constant');
const { createStudentAccount } = require('../../utils/account');
const { buildRes } = require('../../utils/response');

router.get('/students', validateAdmin, async (req, res, next) => {
  try {
    const studentList = await Users.findAll({ where: { role: role.STUDENT } });
    res.json({
      success: true,
      data: {
        studentList: studentList.map((ele) => {
          ele.password = undefined;
          return ele;
        }),
      },
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      message: 'Something wrong happen, please try again',
    });
  }
});

// Get student by id
router.get('/student/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Users.findOne({ where: { role: role.STUDENT, userId: id } });
    if (student) {
      buildRes(res, true, {
        student: {
          id: student.userId,
          mssv: student.mssv,
          name: student.name,
        },
      });
    } else {
      buildRes(res, false, 'No such student');
    }
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Get student by MSSV
router.get('/student/mssv/:mssv', validateStudent, async (req, res) => {
  try {
    const { mssv } = req.params;
    const student = await Users.findOne({
      where: {
        mssv,
        role: role.STUDENT,
      },
    });
    if (student) {
      res.json({
        success: true,
        data: {
          id: student.userId,
          mssv: student.mssv,
          name: student.name,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'Not exist',
      });
    }
  } catch (e) {
    res.json({
      success: false,
      message: e,
    });
  }
});


// Create student
router.post('/student', validateAdmin, async (req, res) => {
  try {
    const { mssv, name } = req.body;
    const createdStudent = await createStudentAccount(mssv, mssv, name, mssv);
    buildRes(res, true, {
      createdStudent,
    });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Update student by id
router.put('/student/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updateStudent = await Users.update({
      name,
    }, {
      where: {
        userId: id,
        role: role.STUDENT,
      },
    });
    buildRes(res, true, { updateStudent });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Delete subject by id
router.delete('/student/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Users.destroy({
      where: {
        userId: id,
        role: role.STUDENT,
      },
    });
    buildRes(res, true, { deletedStudent });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

router.post('/students/import', validateAdmin, upload.single('students'), async (req, res) => {
  try {
    const data = new Uint8Array(req.file.buffer);
    const studentListWorkSheet = xlsx.read(data, { type: 'array' });
    const studentList = xlsx.utils.sheet_to_json(studentListWorkSheet.Sheets.Sheet1);
    const existStudent = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const student of studentList) {
      const mssv = student[wsSchema.student.mssv].toString();
      const name = student[wsSchema.student.name];
      const duplicatedStudent = await Users.findOne({ where: { mssv } });
      if (!duplicatedStudent) {
        await createStudentAccount(mssv, mssv, name, mssv);
      } else {
        existStudent.push(mssv);
      }
    }
    res.json({
      success: true,
      data: {
        existStudent,
      },
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      message: e,
    });
  }
});

module.exports = router;
