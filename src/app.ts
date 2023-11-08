import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import createDebug from 'debug';
import { errorHandler } from './middleware/error.js';
import { userRouter } from './routers/user.router.js';
import { terminalRouter } from './routers/terminal.router.js';
import { chatRouter } from './routers/chat.router.js';
import { groupRouter } from './routers/group.router.js';
const debug = createDebug('api-iph:App');

export const app = express();

debug('Loaded Express App');

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};


app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.send('Terminals, groups & chats');
});

app.use('/user', userRouter);
app.use('/terminal', terminalRouter);
app.use('/chat', chatRouter);
app.use('/group', groupRouter)

app.use(errorHandler);
