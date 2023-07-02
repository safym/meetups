import { WithNull } from '../utils/withNull.type';

interface SearchData {
  value: string;
}

export type SearchFormNullable = WithNull<SearchData>;
