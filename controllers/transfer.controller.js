const Repairs = require('../models/repairs.models');
const catchAsync = require('../utils/catchAsync');

exports.createTransfer = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  const { user, receiverUser } = req;
  const transfer = new Repairs({
    amount,
    senderUserId: user.id,
    receiverUserId: receiverUser.id,
  });

  await transfer.save();

  await user.update({
    amount: user.amount - amount,
  });
  await receiverUser.update({
    amount: parseFloat(receiverUser.amount) + amount,
  });

  res.status(201).json({
    status: 'success',
    message: 'successful transfer',
  });
});
