import {Component, OnInit} from '@angular/core';
import {LeaderBoardPosition, Session} from "../../entitys/session-entitys";
import {Router} from "@angular/router";
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {api} from "../../api";

@Component({
    selector: 'app-select-menu',
    templateUrl: 'select-menu.component.html',
    styleUrls: ['./select-menu.component.scss'],
    standalone: true,
    imports: [NgFor, MatCardModule, MatRippleModule, MatIconModule]
})
export class SelectMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
  }

  sessionList: Session[] = [];



  async ngOnInit(): Promise<void> {
    await this.http.get(api + 'grupos').forEach((grupos) => {
      // @ts-ignore
      this.sessionList = grupos.Grupos;
    })
  }

  goToGraph(groupId: string, groupName: string): void {
    this.router.navigate(["graph/" + groupId + '/' + groupName]).then();
  }
}
