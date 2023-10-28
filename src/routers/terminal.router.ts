import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { Repo } from '../repository/repo.js';
import { Terminal } from '../entities/terminal.js';
import { TerminalRepo } from '../repository/terminal.mongo.repository.js';
import { TerminalController } from '../controllers/terminal.controller.js';
import { User } from '../entities/user.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
const debug = createDebug('NB:TerminalRouter');

debug('Executed');

const terminalRepo: Repo<Terminal> = new TerminalRepo();
const userRepo: Repo<User> = new UserRepo();
const controller = new TerminalController(terminalRepo, userRepo);
export const terminalRouter = createRouter();
const auth = new AuthInterceptor(userRepo);


terminalRouter.get('/', controller.getAll.bind(controller));
terminalRouter.get('/:id', controller.getById.bind(controller));
terminalRouter.post('/', auth.logged.bind(auth), controller.post.bind(controller)
);
terminalRouter.patch('/:id', auth.logged.bind(auth), auth.authorized.bind(auth), controller.patch.bind(controller));
terminalRouter.delete('/:id', auth.logged.bind(auth), auth.authorized.bind(auth), controller.deleteById.bind(controller)
);
