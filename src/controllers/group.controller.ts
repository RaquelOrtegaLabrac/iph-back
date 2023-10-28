import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { Controller } from './controller.js';
import createDebug from 'debug';
import { PayloadToken } from '../services/auth.js';
import { GroupRepo } from '../repository/group.mongo.repository.js';
import { Group } from '../entities/group.js';
const debug = createDebug('FP.I:GroupController');

export class GroupController extends Controller<Group> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: GroupRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('BODY', req.body);
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newGroup = await this.repo.create(req.body);
      this.userRepo.update(user.id, user);
      res.status(201);
      console.log('this');
      res.send(newGroup);
    } catch (error) {
      next(error);
    }
  }
}
