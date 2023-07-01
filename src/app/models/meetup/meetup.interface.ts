import { WithNull } from 'src/app/utils/withNull.type';
import { User } from '../user/user.interface';

export interface Meetup {
  name: string;
  description: string;
  location: string;
  target_audience: string;
  need_to_know: string;
  will_happen: string;
  reason_to_come: string;
  time: string;
  duration: number;
}

export interface MeetupResponse extends Meetup {
  id: number;
  description: string;
  createdBy: number;
  owner: User;
  users: User[];
}

export type MeetupFormNullable = WithNull<Meetup>;
