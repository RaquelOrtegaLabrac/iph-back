import { Terminal } from '../entities/terminal.js';
import { Repo } from './repo.js';
import { TerminalModel } from './terminal.mongo.model.js';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
import { GroupModel } from './group.mongo.model.js';

const debug = createDebug('NB:TerminalRepo ');

export class TerminalRepo implements Repo<Terminal> {
  constructor() {
    debug('Instantiated', TerminalModel);
  }

  async query(): Promise<Terminal[]> {
    const allData = await TerminalModel.find()
      .populate('owner', { terminals: 0 })
      .exec();
    return allData;
  }

  async queryById(id: string): Promise<Terminal> {
    const result = await TerminalModel.findById(id)
      .populate('owner', { sightings: 0 })
      .exec();
    if (result === null)
      throw new HttpError(400, 'Not found', 'No user found with this id');
    return result;
  }

  async create(data: Omit<Terminal, 'id'>): Promise<Terminal> {
    const { name, battery, wifiLevel, isConnected, owner, group } = data;

    const foundGroup = await GroupModel.findOne({ name: group });

    if (foundGroup) {
      const newTerminal = await TerminalModel.create({ name, battery, wifiLevel, isConnected, owner, group: foundGroup._id });

      foundGroup.terminals.push(newTerminal);
      await foundGroup.save();

      return newTerminal;
    }

    throw new HttpError(400, 'Bad Request', `Group "${group}" not found`);
  }

  async update(id: string, data: Partial<Terminal>): Promise<Terminal> {
    const newSighting = await TerminalModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (newSighting === null)
      throw new HttpError(404, 'Not found', 'Invalid id');
    return newSighting;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Terminal[]> {
    const result = await TerminalModel.find({ [key]: value }).exec();
    return result;
  }

  async delete(id: string): Promise<void> {
    const deletedTerminal = await TerminalModel.findByIdAndDelete(id).exec();
    if (deletedTerminal === null) throw new HttpError(404, 'Not found', 'Invalid id');

    // Elimina el terminal del grupo
    if (deletedTerminal.group) {
      const group = await GroupModel.findById(deletedTerminal.group).exec();
      if (group) {
        group.terminals = group.terminals.filter((terminalId) => terminalId.toString() !== id);
        await group.save();
      }
    }
  }
}
