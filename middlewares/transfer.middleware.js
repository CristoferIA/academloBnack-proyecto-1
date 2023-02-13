const Repairs = require('../models/repairs.models');
const User = require('../models/user.models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validateUserExist = catchAsync(async (req, res, next) => {
  const { amount, senderAccountNumber, receiverAccountNumber } = req.body;

  const user = await User.findOne({
    where: {
      accountNumber: senderAccountNumber,
      status: 'enabled',
    },
  });

  if (!user) {
    next(
      new AppError(
        'El número de cuenta del emisor no está disponible o no existe',
        404
      )
    );
  }

  if (amount > user.amount || amount <= 0) {
    next(new AppError('El monto es insuficiente', 404));
  }

  const receiverUser = await User.findOne({
    where: {
      accountNumber: receiverAccountNumber,
      status: 'enabled',
    },
  });
  if (!receiverUser) {
    next(
      new AppError(
        'El número de cuenta del receptor no está disponible o no existe',
        404
      )
    );
  }

  req.user = user;
  req.receiverUser = receiverUser;
  next();
});
