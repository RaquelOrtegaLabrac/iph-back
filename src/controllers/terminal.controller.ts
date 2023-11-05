import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { Controller } from './controller.js';
import createDebug from 'debug';
import { PayloadToken } from '../services/auth.js';
import { TerminalRepo } from '../repository/terminal.mongo.repository.js';
import { Terminal } from '../entities/terminal.js';
const debug = createDebug('FP.I:TerminalController');


export class TerminalController extends Controller<Terminal> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: TerminalRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }



  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newTerminal = await this.repo.create(req.body);



      this.userRepo.update(user.id, user);
      res.status(201);
      res.send(newTerminal);
    } catch (error) {
      next(error);
    }
  }

  async postupdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, battery, wifiLevel, isConnected, group, owner } = req.body;


      const updatedData = {
        name,
        battery,
        wifiLevel,
        isConnected,
        group,
        owner
      };

      const updatedTerminal = await this.repo.update(req.params.id, updatedData);
      res.status(200).json(updatedTerminal);
      console.log('updated Terminal', updatedTerminal)
    } catch (error) {
      next(error);
    }
  }


async deleteById(req: Request, res: Response, next: NextFunction) {
    try {

      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const terminal = await this.repo.queryById(req.params.id);
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
