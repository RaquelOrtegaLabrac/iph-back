import { Terminal } from './terminal';
import { User } from './user';

export type Group = {
  id: string;
  name: string;
  terminals: Terminal[];
  owner: User;

};
