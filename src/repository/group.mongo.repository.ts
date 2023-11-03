import { Group } from '../entities/group.js';
import { Repo } from './repo.js';
import { GroupModel } from './group.mongo.model.js';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';

const debug = createDebug('NB:GroupRepo ');

export class GroupRepo implements Repo<Group> {
  constructor() {
    debug('Instantiated', GroupModel);
  }

  async query(): Promise<Group[]> {
    const allData = await GroupModel.find()
    .populate('terminals')

      .exec();
    return allData;
  }

  async queryById(id: string): Promise<Group> {
    const result = await GroupModel.findById(id)

      .exec();
    if (result === null)
      throw new HttpError(400, 'Not found', 'No user found with this id');
    return result;
  }

  async create(data: Omit<Group, 'id'>): Promise<Group> {
    const newGroup = await GroupModel.create(data);
    return newGroup;
  }

  async update(id: string, data: Partial<Group>): Promise<Group> {
    const newGroup = await GroupModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (newGroup === null)
      throw new HttpError(404, 'Not found', 'Invalid id');
    return newGroup;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Group[]> {
    const result = await GroupModel.find({ [key]: value }).exec();
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await GroupModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not found', 'Invalid id');
  }
}
