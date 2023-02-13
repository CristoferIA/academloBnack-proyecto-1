const { promisify } = require('util');
const User = require('../models/user.models');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.validateExistUser = catchAsync(async (req, res, next) => {
  const accountNumber = Math.floor(100000 + Math.random() * 900000);
  const user = await User.findOne({
    where: {
      accountNumber,
    },
  });
  if (user) {
    this.validateIfExistUser(req, res, next);
  }
  if (!user) {
    req.body.accountNumber = accountNumber;
    next();
  }
});

exports.validateAccountNumber = catchAsync(async (req, res, next) => {
  const { accountNumber, password } = req.body;
  const user = await User.findOne({
    where: {
      accountNumber,
      status: 'enabled',
    },
  });

  if (!user) {
    return next(new AppError('The user could not be found', 404));
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect account number or password', 404));
  }

  req.user = user;

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Obtener token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Your are not logged in! Please log in to get acced', 401)
    );
  }

  // 2. verification token

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  // 3. check if user still exist
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'enabled',
    },
  });
  if (!user) {
    return next(
      new AppError('the owner of this token it not longer available', 401)
    );
  }

  // 4. check if user changed password after the token was issued

  if (user.passwordChangetAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangetAt.getTime() / 1000,
      10
    );

    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError(
          'User recently changed password!, please login again.',
          401
        )
      );
    }
  }

  req.sessionUser = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;
  if (user.id !== sessionUser.id) {
    next(new AppError('Your do not own this account', 401));
  }
  next();
});
