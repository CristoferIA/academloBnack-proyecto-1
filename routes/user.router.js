const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login } = require('../controllers/user.controller');
const {
  validateExistUser,
  validateAccountNumber,
} = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();
router.post(
  '/signup',
  [
    check('name', 'username is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
    validateFields,
  ],
  validateExistUser,
  createUser
);

router.post(
  '/login',
  [
    check('accountNumber', 'username is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
    validateFields,
  ],
  validateAccountNumber,
  login
);

module.exports = {
  userRouter: router,
};
