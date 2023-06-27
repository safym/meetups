import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { MeetupService } from 'src/app/services/meetup.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  userList: User[] = [];
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTodoList();
  }

  getTodoList(): void {
    this.isLoading = true;
    this.userService
      .loadUserList()
      .subscribe({
        next: (response: User[]) => {
          console.log(response);
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
