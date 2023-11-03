import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { Controller } from './controller.js';
import createDebug from 'debug';
import { PayloadToken } from '../services/auth.js';
import { TerminalRepo } from '../repository/terminal.mongo.repository.js';
import { Terminal } from '../entities/terminal.js';
import { TerminalModel } from '../repository/terminal.mongo.model.js';
const debug = createDebug('FP.I:TerminalController');

export class TerminalController extends Controller<Terminal> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: TerminalRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  // Async post(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     console.log('BODY', req.body);
  //     const { id: userId } = req.body.tokenPayload as PayloadToken;
  //     const user = await this.userRepo.queryById(userId);
  //     delete req.body.tokenPayload;
  //     req.body.owner = userId;
  //     const newTerminal = await this.repo.create(req.body);
  //     this.userRepo.update(user.id, user);
  //     res.status(201);
  //     console.log('USERID: ', user.id)
  //     console.log('this');
  //     res.send(newTerminal);
  //     console.log('NEW TERMINl', newTerminal)
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('BODY', req.body);
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      console.log('USERID', userId)
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newTerminal = await this.repo.create(req.body);
      console.log('newTerminal ', newTerminal)
      this.userRepo.update(user.id, user);
      console.log('userRepo Update:', user)
      res.status(201);
      console.log('this');
      res.send(newTerminal);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const terminal = await TerminalModel.findById(req.params.id);
      console.log('3');

      if (terminal && userId === terminal.owner.toString()) {
        const updatedTerminal = await TerminalModel.findByIdAndUpdate(
          req.params.id,
          { name: req.body.get('name') },
          { new: true }
        );
        console.log('4');
        res.status(200).json(updatedTerminal);
      } else {
        console.log('5');
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('BODY', req.body);

      const { id: userId } = req.body.tokenPayload as PayloadToken;
      console.log({ userId });
      const terminal = await this.repo.queryById(req.params.id);
      console.log({ terminal });
      if (terminal && userId === terminal.owner.id) {
        await this.repo.delete(req.params.id);
        res.status(201);
        res.send(terminal);
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }
}
