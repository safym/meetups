import { WithNull } from 'src/app/utils/withNull.type';
import { UserResponse } from './user.interface';

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
  [key: string]: string | number | UserResponse | UserResponse[];
}

export interface MeetupResponse extends Meetup {
  id: number;
  description: string;
  createdBy: number;
  owner: UserResponse;
  users: UserResponse[];
}

export type MeetupFormNullable = WithNull<Meetup>;
