const User = require('../models/user.models');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/JWT');

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, password, accountNumber } = req.body;
  const user = new User({ name, accountNumber, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  const token = await generateJWT(user.id);
  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    token,
    user: {
      name: user.name,
      accountNumber: user.accountNumber,
      amount: user.amount,
      status: user.status,
      createdAt: user.createdAt,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { user } = req;
  const token = await generateJWT(user.id);
  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      accountNumber: user.accountNumber,
      amount: user.amount,
      status: user.status,
    },
  });
});
