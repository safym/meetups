import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent {
  @Input() user: User;
  selected = 'ADMIN';
  isEdit: boolean = false;

  toggleEditMode() {
    this.isEdit = !this.isEdit
  }
}
