const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { validateAdmin } = require('../../middleware/auth');

const {
  Subjects, Users, LearningStates, Rooms,
} = require('../../models/sequelize');
const { wsSchema } = require('../../constant');
const { buildRes } = require('../../utils/response');
const { createStudentAccount } = require('../../utils/account');

const upload = multer();

// Get all room
router.get('/rooms', validateAdmin, async (req, res) => {
  try {
    const roomList = await Rooms.findAll();
    res.json({
      success: true,
      data: {
        roomList,
      },
    });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Get room by id
router.get('/room/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Rooms.findOne({
      roomId: id,
    });
    if (room) {
      buildRes(res, true, { room });
    } else {
      buildRes(res, false, 'No such room');
    }
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Create room
router.post('/room', validateAdmin, async (req, res) => {
  try {
    const { roomName, totalSlot } = req.body;
    const createdRoom = await Rooms.create({
      roomName,
      totalSlot,
    });
    buildRes(res, true, { room: createdRoom });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Update room
router.put('/room/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { roomName, totalSlot } = req.body;
    const updatedRoom = await Rooms.update({
      roomName,
      totalSlot,
    }, {
      where: {
        roomId: id,
      },
    });

    buildRes(res, true, { updatedRoom });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Delete room
router.delete('/room/:id', validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await Rooms.destroy({
      where: {
        roomId: id,
      },
    });
    buildRes(res, true, { deletedRoom });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});

// Import room from excel
router.post('/rooms/import', validateAdmin, upload.single('rooms'), async (req, res) => {
  try {
    const data = new Uint8Array(req.file.buffer);
    const roomListWorkSheet = xlsx.read(data, { type: 'array' });
    const roomList = xlsx.utils.sheet_to_json(roomListWorkSheet.Sheets.Sheet1);

    const existRooms = [];

    for (const room of roomList) {
      const name = room[wsSchema.room.name];
      const slot = room[wsSchema.room.slot];

      const duplicateRoom = await Rooms.findOne({
        where: { roomName: name },
      });

      if (!duplicateRoom) {
        await Rooms.create({
          roomName: name,
          totalSlot: slot,
        });
      } else {
        await Rooms.update({ totalSlot: slot }, {
          where: { roomName: name },
        });
        existRooms.push(name);
      }
    }
    buildRes(res, true, { existRooms });
  } catch (e) {
    console.error(e);
    buildRes(res, false, e);
  }
});


module.exports = router;
