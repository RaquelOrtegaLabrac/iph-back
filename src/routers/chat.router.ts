import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { Repo } from '../repository/repo.js';
import { Chat } from '../entities/chat.js';
import { ChatRepo } from '../repository/chat.mongo.repository.js';
import { ChatController } from '../controllers/chat.controller.js';
import { User } from '../entities/user.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
const debug = createDebug('NB:ChatRouter');

debug('Executed');

const chatRepo: Repo<Chat> = new ChatRepo();
const userRepo: Repo<User> = new UserRepo();
const controller = new ChatController(chatRepo, userRepo);
export const chatRouter = createRouter();
const auth = new AuthInterceptor(userRepo);


chatRouter.get('/', controller.getAll.bind(controller));
chatRouter.get('/:id', controller.getById.bind(controller));
chatRouter.post('/', auth.logged.bind(auth), controller.post.bind(controller)
);
