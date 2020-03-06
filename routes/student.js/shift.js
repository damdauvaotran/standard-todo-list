const router = require('express').Router();
const { Op } = require('sequelize');

const { getUserId } = require('../../utils/account');
const { validateStudent } = require('../../middleware/auth');
const { buildRes } = require('../../utils/response');
const {
  Subjects, LearningStates, Users, Rooms, ExamShifts, ExamRegistrations, Semesters,
} = require('../../models/sequelize');

// Get all shift
router.get('/shifts', validateStudent, async (req, res) => {
  try {
    const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
    const userID = getUserId(authToken);
    const subjectList = await Subjects.findAll({
      include: [{
        model: LearningStates,
        where: { userId: userID, isAllowed: true },
        required: true,
      }],
    });
    const subjectIdList = subjectList.map((ele) => ele.subjectId);

    const shiftList = await ExamShifts.findAll({
      where: {
        subjectId: {
          [Op.in]: subjectIdList,
        },
      },
    });
    buildRes(res, true, { shiftList });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e.toString());
  }
});

// Register to a shift
router.post('/shift/:id/register', validateStudent, async (req, res) => {
  try {
    const registerShiftId = req.params.id;
    const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
    const userId = getUserId(authToken);


    // Get allowed subject by user
    const allowedSubjectList = await Subjects.findAll({
      include: [{
        model: LearningStates,
        where: { userId, isAllowed: true },
      }],
    });
    const allowedSubjectIdList = allowedSubjectList.map((ele) => ele.subjectId);

    // Get shift of allowed subject
    const allowedShiftList = await ExamShifts.findAll({
      where: {
        subjectId: {
          [Op.in]: allowedSubjectIdList,
        },
      },
    });

    const allowedShiftIdtList = allowedShiftList.map((ele) => ele.examShiftId.toString());
    if (allowedShiftIdtList.includes(registerShiftId)) {
      // Check if that shift has enough slot
      const registerShift = await ExamShifts.findOne({
        where: {
          examShiftId: registerShiftId,
        },
      });

      if (registerShift) {
        // Check if it has remaining slot

        // const registeredSlot = registerShift.registered;
        // Count in db
        const registeredSlot = await ExamRegistrations.count({
          where: {
            examShiftId: registerShiftId,
          },
        });

        const examRoom = await Rooms.findOne({
          where: {
            roomId: registerShift.roomId,
          },
        });

        const { totalSlot } = examRoom;
        const remainingSlot = totalSlot - registeredSlot;

        if (remainingSlot > 0) {
          // Check if this student has register this shift
          const isStudentRegistered = await ExamRegistrations.findOne({
            where: {
              userId,
              examShiftId: registerShiftId,
            },
          });

          if (!isStudentRegistered) {
            // Register
            const registeredShiftInstance = await ExamRegistrations.create({
              userId,
              examShiftId: registerShiftId,
            });
            buildRes(res, true, { register: registeredShiftInstance });
          } else {
            buildRes(res, false, 'You have registered this shift');
          }
        } else {
          buildRes(res, false, 'Not enough slot');
        }
      } else {
        buildRes(res, false, 'Shift not exist');
      }
    } else {
      buildRes(res, false, 'You are not allow to register this');
    }
  } catch (e) {
    console.error(e);
    buildRes(res, false, e.toString());
  }
});

// //////////////////////////////////////////////////////////////-----------------------------..//////////
// Get all shift
router.get('/shifts/semester/:semesterId', validateStudent, async (req, res) => {
  try {
    const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
    const userID = getUserId(authToken);
    const { semesterId } = req.params;
    const subjectList = await Subjects.findAll({
      include: [{
        model: LearningStates,
        where: { userId: userID, isAllowed: true },
        required: true,
      }],
    });
    const subjectIdList = subjectList.map((ele) => ele.subjectId);

    const shiftList = await ExamShifts.findAll({
      where: {
        subjectId: {
          [Op.in]: subjectIdList,
        },
      },
      include: [
        {
          attributes: [],
          model: Semesters,
          required: true,
          where: {
            semesterId,
            isActive: true,
          },
        },
      ],
    });
    buildRes(res, true, { shiftList });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e.toString());
  }
});

// Thừa để đấy
router.post('/shift/:id/register/semester/:semesterId', validateStudent, async (req, res) => {
  try {
    const { semesterId } = req.params;
    const registerShiftId = req.params.id;
    const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
    const userId = getUserId(authToken);


    // Get allowed subject by user
    const allowedSubjectList = await Subjects.findAll({
      include: [{
        model: LearningStates,
        where: { userId, isAllowed: true },
      }],
    });
    const allowedSubjectIdList = allowedSubjectList.map((ele) => ele.subjectId);

    // Get shift of allowed subject
    const allowedShiftList = await ExamShifts.findAll({
      where: {
        subjectId: {
          [Op.in]: allowedSubjectIdList,
        },
      },
    });

    const allowedShiftIdtList = allowedShiftList.map((ele) => ele.examShiftId.toString());
    if (allowedShiftIdtList.includes(registerShiftId)) {
      // Check if that shift has enough slot
      const registerShift = await ExamShifts.findOne({
        where: {
          examShiftId: registerShiftId,
        },
      });

      if (registerShift) {
        // Check if it has remaining slot

        // const registeredSlot = registerShift.registered;
        // Count in db
        const registeredSlot = await ExamRegistrations.count({
          where: {
            examShiftId: registerShiftId,
          },
        });

        const examRoom = await Rooms.findOne({
          where: {
            roomId: registerShift.roomId,
          },
        });

        const { totalSlot } = examRoom;
        const remainingSlot = totalSlot - registeredSlot;

        if (remainingSlot > 0) {
          // Check if this student has register this shift
          const isStudentRegistered = await ExamRegistrations.findOne({
            where: {
              userId,
              examShiftId: registerShiftId,
            },
          });

          if (!isStudentRegistered) {
            // Register
            const registeredShiftInstance = await ExamRegistrations.create({
              userId,
              examShiftId: registerShiftId,
            });
            buildRes(res, true, { register: registeredShiftInstance });
          } else {
            buildRes(res, false, 'You have registered this shift');
          }
        } else {
          buildRes(res, false, 'Not enough slot');
        }
      } else {
        buildRes(res, false, 'Shift not exist');
      }
    } else {
      buildRes(res, false, 'You are not allow to register this');
    }
  } catch (e) {
    console.error(e);
    buildRes(res, false, e.toString());
  }
});

module.exports = router;
