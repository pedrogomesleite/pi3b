import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SelectMenuComponent} from './components/select-menu/select-menu.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRippleModule} from "@angular/material/core";
import {GraphShowComponent} from './components/graphs/graph-show/graph-show.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {SharedGraphService} from "./services/shared-graph.service";
import {GraphService} from "./services/graph.manipulation.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatRippleModule,
    MatExpansionModule,
    LoginComponent,
    SelectMenuComponent,
    GraphShowComponent,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    SharedGraphService,
    GraphService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
