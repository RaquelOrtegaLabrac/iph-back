import { Schema, model } from 'mongoose';
import { Chat } from '../entities/chat';

const chatSchema = new Schema<Chat>({
  name: {
    type: String,
    required: false,
    unique: false,
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  isActive: {
    type: String,
    required: false,
    unique: false
  },
    owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

chatSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    if (Array.isArray(returnedObject.participants)) {
      returnedObject.participants = returnedObject.participants.filter(p => p !== null);
    }
  },
});

export const ChatModel = model(
  'Chat',
  chatSchema,
  'chats'
);
