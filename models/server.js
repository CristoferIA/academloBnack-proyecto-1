const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const globalErrorHandler = require('../controllers/error.controller');
const AppError = require('../utils/appError');
const { db } = require('../database/db');
const { userRouter } = require('../routes/user.router');
const { transfersRouter } = require('../routes/transfers.router');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.paths = {
      users: '/api/v1/user',
      transfers: '/api/v1/transfers',
    };

    this.database();
    this.middleware();
    this.routes();
  }
  middleware() {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    this.app.use(cors());
    this.app.use(express.json());
  }
  routes() {
    this.app.use(this.paths.users, userRouter);
    this.app.use(this.paths.transfers, transfersRouter);

    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`¡Can't find ${req.originalUrl} on this server!`, 404)
      );
    });

    this.app.use(globalErrorHandler);
  }
  database() {
    db.authenticate()
      .then(() => console.log('database authenticated'))
      .catch(err => console.log(err));

    db.sync() // {force:true} :sincroniza los cambios de los models pero borra todos los datos
      .then(() => console.log('Database synced'))
      .catch(err => console.log(err));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log('Server running on port', this.port);
    });
  }
}

module.exports = Server;
