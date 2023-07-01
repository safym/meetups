import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User, UserResponse } from 'src/app/models/user/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  userList: UserResponse[] = [];
  isLoading = false;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(): void {
    this.isLoading = true;
    this.userService
      .loadUserList()
      .subscribe({
        next: (response: UserResponse[]) => {
          this.userList = response;
          this.userService.userList = this.userList;
        },
      })
      .add(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
}
