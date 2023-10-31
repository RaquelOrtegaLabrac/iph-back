import { User } from "./user";

export type Chat = {
  id: string;
  name: string;
  participants: User[];
  isActive:
  | 'yes'
  | 'no'
};
