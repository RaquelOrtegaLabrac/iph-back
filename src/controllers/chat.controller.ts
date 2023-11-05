import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { Controller } from './controller.js';
import createDebug from 'debug';
import { PayloadToken } from '../services/auth.js';
import { ChatRepo } from '../repository/chat.mongo.repository.js';
import { Chat } from '../entities/chat.js';
const debug = createDebug('FP.I:ChatController');

export class ChatController extends Controller<Chat> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: ChatRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newChat = await this.repo.create(req.body);
      this.userRepo.update(user.id, user);
      res.status(201);
      res.send(newChat);
    } catch (error) {
      next(error);
    }
  }
}
