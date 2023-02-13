const { validationResult } = require('express-validator');

exports.validateFields = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      erros: erros.mapped(),
    });
  }

  next();
};
