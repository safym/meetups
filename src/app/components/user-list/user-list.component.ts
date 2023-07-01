import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RoleResponse } from 'src/app/models/role/role.interface';
import { UserResponse } from 'src/app/models/user/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  userList: UserResponse[] = [];
  roleList: RoleResponse[] = [];
  isLoading = false;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getUserList();
    this.getRoleList();
  }

  getRoleList() {
    this.isLoading = true;
    this.userService
      .getRoleList()
      .subscribe({
        next: response => {
          console.log(response);
          this.roleList = response;
        },
        error: error => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      })
      .add(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  getUserList(): void {
    this.isLoading = true;
    this.userService
      .loadUserList()
      .subscribe({
        next: (response: UserResponse[]) => {
          this.userList = response;
          console.log(this.userList);
        },
      })
      .add(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
}
