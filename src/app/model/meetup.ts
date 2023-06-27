import { IMeetup, Organizer } from "./meetup.interface";

export class Meetup implements IMeetup {
  public id: number;
  public name: string;
  public date: Date;
  public location: string;
  public shortDescription: string;
  public detailedDescription: string;
  public targetAudience: string;
  public requirements: string;
  public agenda: string;
  public reasonToAttend: string;
  public organizer: Organizer;

  constructor(meetupData: IMeetup) {
    this.id = meetupData.id;
    this.name = meetupData.name;
    this.date = meetupData.date;
    this.location = meetupData.location;
    this.shortDescription = meetupData.shortDescription;
    this.detailedDescription = meetupData.detailedDescription;
    this.targetAudience = meetupData.targetAudience;
    this.requirements = meetupData.requirements;
    this.agenda = meetupData.agenda;
    this.reasonToAttend = meetupData.reasonToAttend;
    this.organizer = meetupData.organizer;
  }
}