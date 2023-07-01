import { Component, Input } from '@angular/core';
import { UserResponse } from 'src/app/models/user/user.interface';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent {
  @Input() user: UserResponse;
  selected = 'ADMIN';
  isEdit = false;

  toggleEditMode() {
    this.isEdit = !this.isEdit;
  }
}
