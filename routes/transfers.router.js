const { Router } = require('express');
const { check } = require('express-validator');
const { createTransfer } = require('../controllers/transfer.controller');
const { validateUserExist } = require('../middlewares/transfer.middleware');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/user.middleware');

const router = Router();

router.use(protect);
router.post(
  '/',
  [
    check('amount', 'el monto es requerido').not().isEmpty(),
    check('senderAccountNumber', 'El número de cuenta del emisor es requerido')
      .not()
      .isEmpty(),
    check(
      'receiverAccountNumber',
      'El número de cuenta de receptor es requerido'
    )
      .not()
      .isEmpty(),
  ],
  validateUserExist,
  protectAccountOwner,
  createTransfer
);

module.exports = {
  transfersRouter: router,
};
