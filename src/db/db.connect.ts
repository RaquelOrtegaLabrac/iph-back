import mongoose from 'mongoose';
import { user, password, db } from '../config.js';

export const dbConnect = () => {

  const uri = `mongodb+srv://${user}:${password}@cluster0.ojlpryl.mongodb.net/${db}?retryWrites=true&w=majority`
  console.log(uri);
  return mongoose.connect(uri);
};
