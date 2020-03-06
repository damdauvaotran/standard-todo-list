const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { validateAdmin } = require('../../middleware/auth');

const { Subjects, Users, LearningStates } = require('../../models/sequelize');
const { wsSchema } = require('../../constant');
const { buildRes } = require('../../utils/response');
const { createStudentAccount } = require('../../utils/account');

const upload = multer();

router.get('/subjects', validateAdmin, async (req, res) => {
  try {
    const subjectList = await Subjects.findAll();
    buildRes(res, true, { subjectList });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});


// Create subject by id
router.get('/subject/:subjectId', validateAdmin, async (req, res) => {
  try {
    const subject = await Subjects.findOne({
      where: {
        subjectId: req.params.subjectId,
      },
    });
    if (subject) {
      res.json({
        success: true,
        data: {
          subject,
        },
      });
    } else {
      buildRes(res, false, 'No such subject');
    }
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Create subject
router.post('/subject', validateAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const credit = req.body.credit || 3;

    const createdSubject = await Subjects.create({
      subjectName: name,
      subjectCredit: credit,
    });

    buildRes(res, true, { createdSubject });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Update subject by id
router.put('/subject/:subjectId', validateAdmin, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, credit } = req.body;
    const updateSubject = await Subjects.update({
      subjectName: name,
      subjectCredit: credit,
    }, {
      where: {
        subjectId,
      },
    });
    buildRes(res, true, { updateSubject });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Delete subject by id
router.delete('/subject/:subjectId', validateAdmin, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const deletedSubject = await Subjects.destroy({
      where: {
        subjectId,
      },
    });
    buildRes(res, true, { deletedSubject });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Import subject by excel file
router.post('/subjects/import', validateAdmin, upload.single('subjects'), async (req, res) => {
  try {
    const data = new Uint8Array(req.file.buffer);
    const subjectListWorkSheet = xlsx.read(data, { type: 'array' });
    const subjectList = xlsx.utils.sheet_to_json(subjectListWorkSheet.Sheets.Sheet1);
    const existSubjects = [];


    for (const subject of subjectList) {
      const subjectName = subject[wsSchema.subject.name];
      const credit = subject[wsSchema.subject.credit];
      // eslint-disable-next-line no-await-in-loop
      const duplicateSubject = await Subjects.findOne({
        where: { subjectName },
      });

      if (!duplicateSubject) {
        await Subjects.create({
          subjectName,
          subjectCredit: credit,
        });
      } else {
        await Subjects.update({ subjectCredit: credit }, {
          where: {
            subjectName,
          },
        });
        existSubjects.push(subjectName);
      }
    }

    res.json({
      success: true,
      data: {
        existSubjects,
      },
    });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Import student that allowed in this subject
router.post('/subject/:subjectId/import/', validateAdmin, upload.single('students'), async (req, res) => {
  try {
    const { subjectId } = req.params;
    const data = new Uint8Array(req.file.buffer);
    const allowStudentListWorkSheet = xlsx.read(data, { type: 'array' });
    const allowStudentList = xlsx.utils.sheet_to_json(allowStudentListWorkSheet.Sheets.Sheet1);


    const isSubjectExist = await Subjects.findOne({
      where: {
        subjectId,
      },
    });

    if (isSubjectExist) {
      const duplicateLearningState = [];
      for (const student of allowStudentList) {
        const mssv = student[wsSchema.allowedStudent.mssv].toString();
        const name = student[wsSchema.allowedStudent.name];
        const isAllowed = !!student[wsSchema.allowedStudent.isAllowed];

        // Check is student has exist on system
        const isStudentExist = await Users.findOne({
          where: {
            mssv,
          },
        });
        if (!isStudentExist) {
          await createStudentAccount(mssv, mssv, name, mssv);
        }
        const createdStudent = await Users.findOne({
          where: {
            mssv,
          },
        });

        const isLearningStateExist = await LearningStates.findOne({
          where: {
            userId: createdStudent.userId,
            subjectId: req.params.subjectId,
          },
        });
        if (isLearningStateExist) {
          duplicateLearningState.push(isLearningStateExist);
          await LearningStates.update({
            isAllowed,
          }, {
            where: {
              userId: createdStudent.userId,
              subjectId: req.params.subjectId,
            },
          });
        } else {
          await LearningStates.create({
            userId: createdStudent.userId,
            subjectId,
            isAllowed,
          });
        }
      }

      res.json({
        success: true,
        data: {
          duplicateLearningState,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'No such subject',
      });
    }
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});
module.exports = router;
