import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { PayloadToken } from '../services/auth.js';
import { AuthServices } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';
import { LoginResponse } from '../types/response.api.js';
import createDebug from 'debug';
import { Controller } from './controller.js';
import { User } from '../entities/user.js';
const debug = createDebug('api-iph:UserController');

export class UserController extends Controller<User> {
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const password = await AuthServices.hash(req.body.password);
      req.body.password = password;
      res.status(201);
      res.send(await this.repo.create(req.body));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.userName || !req.body.password)
        throw new HttpError(400, 'Bad Request', 'Invalid user/Password');
      const data = await this.repo.search({
        key: 'userName',
        value: req.body.userName,
      });

      if (!data.length)
        throw new HttpError(400, 'Bad Request', 'Invalid user/Password');
      const isUserValid = await AuthServices.compare(
        req.body.password,
        data[0].password
      );

      if (!isUserValid)
        throw new HttpError(400, 'Bad Request', 'Invalid user/Password');

      const payload: PayloadToken = {
        id: data[0].id,
        userName: data[0].userName,
      };
      const token = AuthServices.createJWT(payload);
      const response: LoginResponse = {
        token,
        user: data[0],
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
