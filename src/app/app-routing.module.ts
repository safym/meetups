import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { MeetupPageComponent } from './pages/meetup-page/meetup-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { MeetupFormPageComponent } from './pages/meetup-form-page/meetup-form-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'meetups', component: MeetupPageComponent, canActivate: [AuthGuard] },
  {
    path: 'my-meetups',
    component: MeetupPageComponent,
    canActivate: [AuthGuard],
    data: { isMyMeetups: true },
  },
  {
    path: 'meetups/create',
    component: MeetupFormPageComponent,
    canActivate: [AuthGuard],
    data: { isEdit: false },
  },
  {
    path: 'meetups/edit/:id',
    component: MeetupFormPageComponent,
    canActivate: [AuthGuard],
    data: { isEdit: true },
  },
  {
    path: 'users',
    component: UsersPageComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: '404', component: NotFoundPageComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
