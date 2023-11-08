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
      .populate('owner', { terminals: 0 })
      .exec();
    if (result === null)
      throw new HttpError(400, 'Not found', 'No terminal found with this id');
    return result;
  }



  async create(data: Omit<Terminal, 'id'>): Promise<Terminal> {
    const { name, battery, wifiLevel, isConnected, group, owner } = data;

    const foundGroup = await GroupModel.findOne({ name: group });

    if (foundGroup) {
      const newTerminal = await TerminalModel.create({
        name,
        battery,
        wifiLevel,
        isConnected,
        group: foundGroup._id,
        owner
      });

      foundGroup.terminals.push(newTerminal);
      await foundGroup.save();


      return newTerminal;
    }

    throw new HttpError(400, 'Bad Request', `Group "${group}" not found`);
  }
  async update(id: string, data: Partial<Terminal>): Promise<Terminal> {
    const { name, battery, wifiLevel, isConnected, group, owner } = data;
  
    const currentTerminal = await TerminalModel.findById(id);
  
    if (!currentTerminal) {
      throw new HttpError(404, 'Not Found', 'Terminal not found');
    }
  
    const currentGroup = await GroupModel.findById(currentTerminal.group);
  
    if (!currentGroup) {
      throw new HttpError(404, 'Not Found', 'Group not found');
    }
  
    const foundGroup = await GroupModel.findOne({ name: group });
  
    if (foundGroup) {
      const query = { _id: id };
      const update = {
        name,
        battery,
        wifiLevel,
        isConnected,
        group: foundGroup._id,
        owner,
      };
  
      const updatedTerminal = await TerminalModel.findByIdAndUpdate(query, update, { new: true });
  
      if (updatedTerminal) {
        currentGroup.terminals = currentGroup.terminals.filter(
          (terminalId) => terminalId.toString() !== id
        );
        await currentGroup.save();
  
        foundGroup.terminals.push(updatedTerminal.id);
        await foundGroup.save();
  
        return updatedTerminal;
      }
    }
    throw new HttpError(400, 'Bad Request', `Group "${group}" not found`);
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

    if (deletedTerminal.group) {
      const group = await GroupModel.findById(deletedTerminal.group).exec();
      if (group) {
        group.terminals = group.terminals.filter((terminalId) => terminalId.toString() !== id);
        await group.save();
      }
    }
  }
}
