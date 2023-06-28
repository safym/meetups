import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Meetup } from 'src/app/models/meetup/meetup';

@Component({
  selector: 'app-meetup-item',
  templateUrl: './meetup-item.component.html',
  styleUrls: ['./meetup-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetupItemComponent {
  @Input() meetup: Meetup;
  detailsIsOpen: boolean = false;

  toggleDetailsOpen() {
    this.detailsIsOpen = !this.detailsIsOpen
  }
}
