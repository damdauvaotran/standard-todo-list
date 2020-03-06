const router = require('express').Router();
const { fn, col } = require('sequelize');

const { getUserId } = require('../../utils/account');
const { validateStudent } = require('../../middleware/auth');
const { buildRes } = require('../../utils/response');
const {
  Subjects, LearningStates, Users, ExamShifts, Rooms, ExamRegistrations, Semesters,
} = require('../../models/sequelize');

// // Get all subject
// router.get('/subjects', validateStudent, async (req, res) => {
//   try {
//     const subjectList = await Subjects.findAll();
//     buildRes(res, true, { subjectList });
//   } catch (e) {
//     console.error(e);
//     buildRes(res, false, e.toString());
//   }
// });

// Get allowed subject
router.get('/subjects', validateStudent, async (req, res) => {
  try {
    const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
    const userId = getUserId(authToken);
    const subjectList = await Subjects.findAll({
      include: [
        {
          attributes: [],
          model: LearningStates,
          where: { userId, isAllowed: true },
          required: true,
        },
        {
          attributes: ['examShiftId', 'examDate', 'from', [fn('COUNT', col('examShifts->examRegistrations.exam_registration_id')), 'registered']],
          model: ExamShifts,
          required: true,
          include: [
            {
              model: Rooms,
              required: true,
            },
            {
              attributes: [],
              model: ExamRegistrations,
              // required: true,
            },
            {
              attributes: [],
              model: Semesters,
              where: {
                isActive: true,
              },
              required: true,
            },
          ],

        },
      ],
      group: 'examShifts.exam_shift_id',
    });
    // const responseData = subjectList.map((ele) => ({
    //   subjectId: ele.subjectId,
    //   subjectName: ele.subjectName,
    //   subjectCredit: ele.subjectName,
    //   learningState: (ele.learningState && ele.learningState[0]) || null,
    // }));

    buildRes(res, true, { subjectList });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e.toString());
  }
});

// Get registered subject
router.get('/subjects/registered', validateStudent, async (req, res) => {
  try {
    const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
    const userId = getUserId(authToken);
    // const subjectList = await Subjects.findAll({
    //   include: [
    //     {
    //       // attributes: [],
    //       model: ExamShifts,
    //       required: true,
    //       include: [
    //         {
    //           model: Rooms,
    //           required: true,
    //         },
    //         {
    //           // attributes: [],
    //           model: ExamRegistrations,
    //           required: true,
    //           where: {
    //             userId,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // });


    const subjectList = await Subjects.findAll({
      include: [
        {
          attributes: ['examShiftId', 'examDate', 'from', [fn('COUNT', col('examShifts->examRegistrations.exam_registration_id')), 'registered']],
          model: ExamShifts,
          required: true,
          include: [
            {
              model: Rooms,
              required: true,
            },
            {
              attributes: [],
              model: ExamRegistrations,
              where: {
                userId,
              },
            },
            {
              attributes: [],
              model: Semesters,
              where: {
                isActive: true,
              },
              required: true,
            },
          ],

        },
      ],
      group: 'examShifts.exam_shift_id',
    });
    buildRes(res, true, {
      subjectList,
    });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// ///////////////////////////////////////////////////////////////
// Get allowed subject
router.get('/subjects/semester/:semesterId', validateStudent, async (req, res) => {
  try {
    const { semesterId } = req.params;
    const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
    const userId = getUserId(authToken);
    const subjectList = await Subjects.findAll({
      include: [
        {
          attributes: [],
          model: LearningStates,
          where: { userId, isAllowed: true },
          required: true,
        },
        {
          attributes: ['examShiftId', 'examDate', 'from', [fn('COUNT', col('examShifts->examRegistrations.exam_registration_id')), 'registered']],
          model: ExamShifts,
          required: true,
          include: [
            {
              model: Rooms,
              required: true,
            },
            {
              attributes: [],
              model: ExamRegistrations,
              // required: true,
            },
            {
              attributes: [],
              model: Semesters,
              where: {
                semesterId,
                isActive: true,
              },
              required: true,
            },
          ],

        },
      ],
      group: 'examShifts.exam_shift_id',
    });
    // const responseData = subjectList.map((ele) => ({
    //   subjectId: ele.subjectId,
    //   subjectName: ele.subjectName,
    //   subjectCredit: ele.subjectName,
    //   learningState: (ele.learningState && ele.learningState[0]) || null,
    // }));

    buildRes(res, true, { subjectList });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e.toString());
  }
});

// Get registered subject
router.get('/subjects/registered/semester/:semesterId', validateStudent, async (req, res) => {
  try {
    const { semesterId } = req.params;
    const authToken = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
    const userId = getUserId(authToken);
    // const subjectList = await Subjects.findAll({
    //   include: [
    //     {
    //       // attributes: [],
    //       model: ExamShifts,
    //       required: true,
    //       include: [
    //         {
    //           model: Rooms,
    //           required: true,
    //         },
    //         {
    //           // attributes: [],
    //           model: ExamRegistrations,
    //           required: true,
    //           where: {
    //             userId,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // });


    const subjectList = await Subjects.findAll({
      include: [
        {
          attributes: ['examShiftId', 'examDate', 'from', [fn('COUNT', col('examShifts->examRegistrations.exam_registration_id')), 'registered']],
          model: ExamShifts,
          required: true,
          include: [
            {
              model: Rooms,
              required: true,
            },
            {
              attributes: [],
              model: ExamRegistrations,
              where: {
                userId,
              },
            },
            {
              attributes: [],
              model: Semesters,
              where: {
                semesterId,
                isActive: true,
              },
              required: true,
            },
          ],

        },
      ],
      group: 'examShifts.exam_shift_id',
    });
    buildRes(res, true, {
      subjectList,
    });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

module.exports = router;
