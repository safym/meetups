import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { MeetupPageComponent } from "./pages/meetup-page/meetup-page.component";

import { AuthGuard } from "./guards/auth.guard";
import { UsersPageComponent } from "./pages/users-page/users-page.component";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginPageComponent },
  { path: "meetups", component: MeetupPageComponent, canActivate: [AuthGuard] },
  { path: "my-meetups", component: MeetupPageComponent, canActivate: [AuthGuard], data: { isMyMeetups: true } },
  { path: "users", component: UsersPageComponent, canActivate: [AuthGuard] },
  { path: "404", component: NotFoundPageComponent },
  { path: "**", redirectTo: "/404" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
