import { Schema, model } from 'mongoose';
import { Chat } from '../entities/chat';
// Import { string } from 'joi';

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
  }
});

chatSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    // Manejar null al acceder a la colección de participantes
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
