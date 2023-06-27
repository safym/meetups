import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MeetupPageComponent } from './pages/meetup-page/meetup-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HeaderComponent } from './components/header/header.component';

import { AppRoutingModule } from './app-routing.module';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeetupListComponent } from './components/meetup-list/meetup-list.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MeetupItemComponent } from './components/meetup-item/meetup-item.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserItemComponent } from './components/user-item/user-item.component';

@NgModule({
  declarations: [
    AppComponent,
    MeetupPageComponent,
    UsersPageComponent,
    NotFoundPageComponent,
    LoginPageComponent,
    HeaderComponent,
    LoginFormComponent,
    MeetupListComponent,
    MeetupItemComponent,
    UserListComponent,
    UserItemComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
