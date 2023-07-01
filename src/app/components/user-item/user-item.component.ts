import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { WithFormControl } from 'src/app/utils/withFormControl.type';
import { compareProperty } from 'src/app/utils/compareProperty';

import { RoleResponse } from 'src/app/models/role.interface';
import { UserResponse, UserFormNullable, UserForm, User } from 'src/app/models/user.interface';

import { UserService } from 'src/app/services/user.service';

type UserFormControls = WithFormControl<UserFormNullable>;

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnChanges {
  @Input() user: UserResponse;
  @Input() roleList: RoleResponse[] = [];
  @Output() deleteUserEvent = new EventEmitter<UserResponse>();

  initialFormData: UserForm;
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
    const { email, password } = this.user;
    const userFormData: UserForm = {
      email,
      password,
      role: {} as RoleResponse,
    };

    const userRole = this.userService.getUserRole(this.user);

    if (userRole) {
      userFormData.role = userRole;
    }

    this.initialFormData = { ...userFormData };
    this.userForm.patchValue(userFormData);
  }

  saveUserData() {
    const initialFormData = this.initialFormData;
    const formData = this.userForm.value;

    const passwordIsChanged = !compareProperty(initialFormData, formData, 'password');
    const emailIsChanged = !compareProperty(initialFormData, formData, 'email');
    const roleIsChanged = !compareProperty(initialFormData, formData, 'role');

    if (passwordIsChanged || emailIsChanged) {
      this.editUserData();
    }

    if (roleIsChanged) {
      this.editUserRole();
    }

    this.toggleEditMode();
  }

  editUserData() {
    const id = this.user.id;
    const userFormData = this.userForm.value as User;

    this.userService
      .editUserData(id, userFormData)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.log(error);
        },
      })
      .add(() => {
        this.cdr.detectChanges();
      });
  }

  editUserRole() {
    const id = this.user.id;
    const roleName = this.userForm.value.role?.name;

    if (!roleName) return;

    this.userService
      .editUserRole(id, roleName)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.log(error);
        },
      })
      .add(() => {
        this.cdr.detectChanges();
      });
  }

  deleteUser() {
    this.deleteUserEvent.emit(this.user);
  }

  toggleEditMode() {
    this.isEdit = !this.isEdit;

    if (this.isEdit) {
      this.enableForm();
    } else {
      this.disableForm();
    }
  }

  disableForm() {
    this.userForm.disable();
  }

  enableForm() {
    this.userForm.enable();
  }
}
