const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { fn, col } = require('sequelize');
const { validateAdmin } = require('../../middleware/auth');

const {
  Subjects, Users, LearningStates, ExamShifts, Rooms,
  ExamRegistrations, Semesters,
} = require('../../models/sequelize');
const { wsSchema, role } = require('../../constant');
const { buildRes } = require('../../utils/response');
const { createStudentAccount } = require('../../utils/account');


// Get all shift
router.get('/shifts', validateAdmin, async (req, res) => {
  try {
    const shiftList = await ExamShifts.findAll({
      attributes: ['examShiftId', 'examDate', 'from', [fn('COUNT', col('examRegistrations.exam_registration_id')), 'registered']],
      include: [
        {
          model: Rooms,
          required: true,
        },
        {
          model: Subjects,
          required: true,
        },
        {
          attributes: [],
          model: ExamRegistrations,
          // required: true,
        },
      ],
      group: 'examShifts.exam_shift_id',
    });
    res.json({
      success: true,
      data: {
        shiftList,
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

router.get('/shifts/registered', validateAdmin, async (req, res) => {
  try {
    const shiftList = await ExamShifts.findAll({
      include: [
        {
          model: Rooms,
          required: true,
        },
        {
          model: Subjects,
          required: true,
        },
        {
          // attributes: [],
          model: ExamRegistrations,
          // required: true,
          include: [{
            model: Users,
          }],
        },
      ],
    });
    res.json({
      success: true,
      data: {
        shiftList,
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


// Get shift by id
router.get('/shift/:id', validateAdmin, async (req, res) => {
  try {
    const shift = await ExamShifts.findOne({
      examShiftId: req.params.id,
    });
    if (shift) {
      res.json({
        success: true,
        data: {
          shift,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'No such shift',
      });
    }
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      message: e,
    });
  }
});

// Get student registered with shift
router.get('/shift/:id/registered', validateAdmin, async (req, res) => {
  try {
    const shiftId = req.params.id;
    const registeredStudentList = await Users.findAll({
      attributes: ['userId', 'name', 'mssv'],
      // where: {
      //   role: role.STUDENT,
      // },
      include: [{
        model: ExamRegistrations,
        // attributes: [],
        where: {
          examShiftId: shiftId,
        },
      }],
    });
    buildRes(res, true, { registeredStudentList });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Create shift
router.post('/shift', validateAdmin, async (req, res) => {
  try {
    const {
      roomId, subjectId, date, from, to,
    } = req.body;
    const createdShift = await ExamShifts.create({
      roomId: parseInt(roomId, '10'),
      subjectId: parseInt(subjectId, '10'),
      examDate: date,
      from,
      to,
    });
    res.json({
      success: true,
      data: {
        subject: createdShift,
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

// Update shift
router.put('/shift/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      roomId, subjectId, date, from, to,
    } = req.body;
    const updatedShift = await ExamShifts.update({
      roomId,
      subjectId,
      examDate: date,
      from,
      to,
    }, {
      where: {
        examShiftId: id,
      },
    });
    buildRes(res, true, { updatedShift });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Delete shift
router.delete('/shift/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId, subjectId, date } = req.body;
    const updatedShift = await ExamShifts.destroy({
      where: {
        examShiftId: id,
      },
    });
    buildRes(res, true, updatedShift);
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});
// /////////////////////////////////////////////

// Get all shift
router.get('/shifts/semester/:semesterId', validateAdmin, async (req, res) => {
  try {
    const { semesterId } = req.params;
    const shiftList = await ExamShifts.findAll({
      attributes: ['examShiftId', 'examDate', 'from', [fn('COUNT', col('examRegistrations.exam_registration_id')), 'registered']],
      include: [
        {
          model: Rooms,
          required: true,
        },
        {
          model: Subjects,
          required: true,
        },
        {
          attributes: [],
          model: ExamRegistrations,
          // required: true,
        },
      ],
      group: 'examShifts.exam_shift_id',
      where: {
        semesterId,
      },
    });
    res.json({
      success: true,
      data: {
        shiftList,
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

// Get shift by id
router.get('/shift/:id/semester/:semesterId', validateAdmin, async (req, res) => {
  try {
    const { semesterId } = req.params;
    const shift = await ExamShifts.findOne({
      where: {
        semesterId,
        examShiftId: req.params.id,
      },

    });
    if (shift) {
      res.json({
        success: true,
        data: {
          shift,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'No such shift',
      });
    }
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      message: e,
    });
  }
});

// Create shift
router.post('/shift/semester/:semesterId', validateAdmin, async (req, res) => {
  try {
    const { semesterId } = req.params;
    const {
      roomId, subjectId, date, from, to,
    } = req.body;
    const createdShift = await ExamShifts.create({
      roomId: parseInt(roomId, '10'),
      subjectId: parseInt(subjectId, '10'),
      examDate: date,
      from,
      to,
      semesterId,
    });
    res.json({
      success: true,
      data: {
        subject: createdShift,
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

// Update shift
router.put('/shift/:id/semester/:semesterId', validateAdmin, async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { id } = req.params;
    const {
      roomId, subjectId, date, from, to,
    } = req.body;
    const updatedShift = await ExamShifts.update({
      roomId,
      subjectId,
      examDate: date,
      from,
      to,
    }, {
      where: {
        examShiftId: id,
        semesterId,
      },
    });
    buildRes(res, true, { updatedShift });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Delete shift
router.delete('/shift/:id/semester/:semesterId', validateAdmin, async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { id } = req.params;
    const { roomId, subjectId, date } = req.body;
    const updatedShift = await ExamShifts.destroy({
      where: {
        examShiftId: id,
        semesterId,
      },
    });
    buildRes(res, true, updatedShift);
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

router.get('/shifts/registered/semester/:semesterId', validateAdmin, async (req, res) => {
  try {
    const { semesterId } = req.params;
    const shiftList = await ExamShifts.findAll({
      include: [
        {
          model: Rooms,
          required: true,
        },
        {
          model: Subjects,
          required: true,
        },
        {
          // attributes: [],
          model: ExamRegistrations,
          // required: true,
          include: [{
            model: Users,
          }],
        },
      ],
      where: {
        semesterId,
      },
    });
    res.json({
      success: true,
      data: {
        shiftList,
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
