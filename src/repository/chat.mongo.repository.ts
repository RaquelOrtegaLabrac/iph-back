import { Chat } from '../entities/chat.js';
import { Repo } from './repo.js';
import { ChatModel } from './chat.mongo.model.js';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';

const debug = createDebug('IPH:ChatRepo ');

export class ChatRepo implements Repo<Chat> {
  constructor() {
    debug('Instantiated', ChatModel);
  }

  async query(): Promise<Chat[]> {
    const allData = await ChatModel.find()
      .populate('participants')
      .exec();
    return allData;
  }

  async queryById(id: string): Promise<Chat> {
    const result = await ChatModel.findById(id)
      .populate('owner', { chats: 0 })
      .exec();
    if (result === null)
      throw new HttpError(400, 'Not found', 'No user found with this id');
    return result;
  }

  async create(data: Omit<Chat, 'id'>): Promise<Chat> {
    const newChat = await ChatModel.create(data);
    return newChat;
  }

  async update(id: string, data: Partial<Chat>): Promise<Chat> {
    const newChat = await ChatModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (newChat === null)
      throw new HttpError(404, 'Not found', 'Invalid id');
    return newChat;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Chat[]> {
    const result = await ChatModel.find({ [key]: value }).exec();
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await ChatModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not found', 'Invalid id');
  }
}
