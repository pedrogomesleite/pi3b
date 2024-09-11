import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {SelectMenuComponent} from "./components/select-menu/select-menu.component";
import {GraphShowComponent} from "./components/graphs/graph-show/graph-show.component";

const routes: Routes = [
  {path: "", redirectTo: "login", pathMatch: "full"},
  {path: "login", component: LoginComponent},
  {path: "select-menu", component: SelectMenuComponent},
  {path: "graph/:nome", component: GraphShowComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
