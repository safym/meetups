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

@NgModule({
  declarations: [
    AppComponent,
    MeetupPageComponent,
    UsersPageComponent,
    NotFoundPageComponent,
    LoginPageComponent,
    HeaderComponent,
    LoginFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
