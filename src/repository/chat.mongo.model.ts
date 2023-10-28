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
    type: Boolean,
    required: false,
    unique: false
  }
});

chatSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.participants;
  },
});

export const ChatModel = model(
  'Chat',
  chatSchema,
  'chats'
);
