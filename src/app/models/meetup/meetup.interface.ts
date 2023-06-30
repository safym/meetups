import { WithNull } from 'src/app/utils/withNull.type';
import { User } from '../user/user';

export interface BaseMeetup {
  name: string;
  location: string;
  target_audience: string;
  need_to_know: string;
  will_happen: string;
  reason_to_come: string;
  time: string;
  duration: number;
}

export interface MeetupResponse extends BaseMeetup {
  id: number;
  description: string;
  createdBy: number;
  owner: User;
  users: User[];
}

export interface MeetupRequest extends BaseMeetup {
  description: string;
}

export interface MeetupForm extends BaseMeetup {
  short_description: string;
  long_description: string;
}

export type MeetupFormNullable = WithNull<MeetupForm>;
