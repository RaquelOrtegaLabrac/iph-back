import { Schema, model } from 'mongoose';
import { Group } from '../entities/group';

const groupSchema = new Schema<Group>({
  name: {
    type: String,
    required: false,
    unique: false,
  },
  terminals: [{
    type: Schema.Types.ObjectId,
    ref: 'Terminal',
  }],
});

groupSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    // Manejar null al acceder a la colección de terminales
    if (Array.isArray(returnedObject.terminals)) {
      returnedObject.terminals = returnedObject.terminals.filter(p => p !== null);
    }
  },
});

export const GroupModel = model(
  'Group',
  groupSchema,
  'groups'
);
