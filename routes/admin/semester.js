const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { validateAdmin } = require('../../middleware/auth');

const {
  Subjects, Users, LearningStates, Semesters,
} = require('../../models/sequelize');
const { wsSchema } = require('../../constant');
const { buildRes } = require('../../utils/response');
const { createStudentAccount } = require('../../utils/account');

const upload = multer();

// Get all semester
router.get('/semesters', validateAdmin, async (req, res) => {
  try {
    const semesterList = await Semesters.findAll();
    res.json({
      success: true,
      data: {
        semesterList,
      },
    });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Get semester by id
router.get('/semester/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const semester = await Semesters.findOne({
      semesterId: id,
    });
    if (semester) {
      buildRes(res, true, { semester });
    } else {
      buildRes(res, false, 'No such semester');
    }
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Create semester
router.post('/semester', validateAdmin, async (req, res) => {
  try {
    const { semesterName, isActive } = req.body;
    const createdSemester = await Semesters.create({
      semesterName,
      isActive,
    });
    buildRes(res, true, { semester: createdSemester });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Update semester
router.put('/semester/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { semesterName, isActive } = req.body;
    const updatedSemester = await Semesters.update({
      semesterName,
      isActive,
    }, {
      where: {
        semesterId: id,
      },
    });

    buildRes(res, true, { updatedSemester });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Delete semester
router.delete('/semester/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSemester = await Semesters.destroy({
      where: {
        semesterId: id,
      },
    });
    buildRes(res, true, { deletedSemester });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Import semester from excel
router.post('/semesters/import', validateAdmin, upload.single('semesters'), async (req, res) => {
  try {
    const data = new Uint8Array(req.file.buffer);
    const semesterListWorkSheet = xlsx.read(data, { type: 'array' });
    const semesterList = xlsx.utils.sheet_to_json(semesterListWorkSheet.Sheets.Sheet1);

    const existSemesters = [];

    for (const semester of semesterList) {
      const name = semester[wsSchema.semester.name];
      const slot = semester[wsSchema.semester.slot];

      const duplicateSemester = await Semesters.findOne({
        where: { semesterName: name },
      });

      if (!duplicateSemester) {
        await Semesters.create({
          semesterName: name,
          totalSlot: slot,
        });
      } else {
        await Semesters.update({ totalSlot: slot }, {
          where: { semesterName: name },
        });
        existSemesters.push(name);
      }
    }
    buildRes(res, true, { existSemesters });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});


module.exports = router;


function ggSheet_to_JSON(sheets, speadSheet_id, sheet_id) {
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
      spreadsheetId: speadSheet_id,
      range: sheet_id,
    }, (err, res) => {
      if (err) {
        reject(new Error(err))
      }
      var str = xlsx.utils.aoa_to_sheet(res.data.values);
      console.log("ddddd");
      // console.log(xlsx.utils.sheet_to_json(str));
      resolve(xlsx.utils.sheet_to_json(str));
      // console.log(json);
    })
  })
}
