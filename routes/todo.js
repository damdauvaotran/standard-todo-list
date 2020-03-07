const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4 } = require('uuid');
const { buildRes } = require('../utils/response');

const router = express.Router();

const todoList = [];

router.get('/', (req, res) => {
  buildRes(res, true, { todoList });
});

router.post(
  '/',
  [body('content').isString(), body('isDone').isBoolean()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return buildRes(res, false, errors.array());
    }
    const id = v4();
    const { content, isDone } = req.body;
    todoList.push({
      id,
      content,
      isDone,
    });
    return buildRes(res, true, { todoList });
  },
);

module.exports = router;
