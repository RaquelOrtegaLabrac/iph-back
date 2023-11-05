import { Schema, model } from 'mongoose';
import { Terminal } from '../entities/terminal';

const terminalSchema = new Schema<Terminal>({
  name: {
    type: String,
    required: false,
    unique: false,
  },
  battery: {
    type: String,
    required: false,
    unique: false,
  },
  wifiLevel: {
    type: String,
    required: false,
    unique: false,
  },
  isConnected: {
    type: String,
    required: false,
    unique: false,
  },
  group: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

terminalSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
  },
});

export const TerminalModel = model(
  'Terminal',
  terminalSchema,
  'terminals'
);
