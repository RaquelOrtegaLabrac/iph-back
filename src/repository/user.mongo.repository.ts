import { UserModel } from './user.mongo.model.js';
import createDebug from 'debug';
import { User } from '../entities/user.js';
import { Repo } from './repo.js';
import { HttpError } from '../types/http.error.js';
import { ChatModel } from './chat.mongo.model.js';

const debug = createDebug('api-iph:UserRepo');

export class UserRepo implements Repo<User> {
  constructor() {
    debug('Instantiated', UserModel);
  }

  async query(): Promise<User[]> {
    const aData = await UserModel.find().exec();
    return aData;
  }

  async queryById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (result === null) throw new HttpError(404, 'Not found', 'Invalid Id');
    return result;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value }).exec();
    return result;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const { userName, password, chat } = data;

    const foundChat = await ChatModel.findOne({ name: chat });

    if (foundChat) {
      const newUser = await UserModel.create({ userName, password, userChat: foundChat._id });

      foundChat.participants.push(newUser);
      await foundChat.save();

      return newUser;
    }

    throw new HttpError(400, 'Bad Request', `Chat "${chat}" not found`);
  }



  async update(id: string, data: Partial<User>): Promise<User> {
    const newUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    if (newUser === null) throw new HttpError(404, 'Not found', 'Invalid Id');
    return newUser;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not found', 'Invalid Id');
  }
}
