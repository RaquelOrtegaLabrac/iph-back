import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { Repo } from '../repository/repo.js';
import { Group } from '../entities/group.js';
import { GroupRepo } from '../repository/group.mongo.repository.js';
import { GroupController } from '../controllers/group.controller.js';
import { User } from '../entities/user.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
const debug = createDebug('NB:GroupRouter');

debug('Executed');

const groupRepo: Repo<Group> = new GroupRepo();
const userRepo: Repo<User> = new UserRepo();
const controller = new GroupController(groupRepo, userRepo);
export const groupRouter = createRouter();
const auth = new AuthInterceptor(userRepo);


groupRouter.get('/', controller.getAll.bind(controller));
groupRouter.get('/:id', controller.getById.bind(controller));
groupRouter.post('/', auth.logged.bind(auth), controller.post.bind(controller)
);
