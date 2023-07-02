import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval, take } from 'rxjs';

import { RoleResponse } from 'src/app/models/role.interface';
import { UserResponse } from 'src/app/models/user.interface';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit, OnDestroy {
  private _userListSubscription: Subscription;
  private _intervalSubscription: Subscription;
  private _loadingInterval: Subscription;
  userList: UserResponse[] = [];
  roleList: RoleResponse[] = [];
  isLoading: boolean = false;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getRoleList();

    this._userListSubscription = this.userService.getUserList().subscribe((userList: UserResponse[]) => {
      this.processUserList(userList);
    });

    this._intervalSubscription = this.userService.getIntervalSubscription();

    this._loadingInterval = interval(0)
      .pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  private processUserList(userList: UserResponse[]): void {
    console.log('userList', userList);
    this.userList = userList;
    this.cdr.detectChanges();
  }

  getRoleList() {
    this.userService
      .getRoleList()
      .subscribe({
        next: roleList => {
          this.roleList = roleList;
        },
        error: error => {
          console.error(error);
        },
      })
      .add(() => {
        this.cdr.detectChanges();
      });
  }

  deleteUser(user: UserResponse) {
    const id = user.id;

    this.userService
      .deleteUser(id)
      .subscribe({
        error: error => {
          console.error(error);
        },
      })
      .add(() => {
        this.cdr.detectChanges();
      });
  }

  trackById(index: number, item: UserResponse): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.isLoading = false;

    if (this._userListSubscription) {
      this._userListSubscription.unsubscribe();
    }

    if (this._intervalSubscription) {
      this._intervalSubscription.unsubscribe();
    }
  }
}
