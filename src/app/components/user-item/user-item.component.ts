import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { WithFormControl } from 'src/app/utils/withFormControl.type';
import { RoleResponse } from 'src/app/models/role/role.interface';
import { UserResponse, UserFormNullable } from 'src/app/models/user/user.interface';

type UserFormControls = WithFormControl<UserFormNullable>;

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnChanges {
  @Input() user: UserResponse;
  @Input() roleList: RoleResponse[] = [];

  userForm: FormGroup<UserFormControls>;
  isEdit = false;

  constructor(private fb: FormBuilder, private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      email: [''],
      password: [''],
      role: [{} as RoleResponse],
    });

    this.patchFormData();
    this.userForm.disable();
  }

  patchFormData() {
    const userRole = this.userService.getUserRole(this.user);

    const userFormData = { ...this.user, role: userRole };

    this.userForm.patchValue(userFormData);
  }

  toggleEditMode() {
    this.isEdit = !this.isEdit;

    if (this.isEdit) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }
  }
}
