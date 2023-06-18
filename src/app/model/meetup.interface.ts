export interface IMeetup {
  id: number;
  name: string;
  date: Date;
  location: string;
  shortDescription: string;
  detailedDescription: string;
  targetAudience: string;
  requirements: string;
  agenda: string;
  reasonToAttend: string;
  organizer: Organizer;
}

export interface Organizer {
  fisrtName: string;
  lastName: string;
}