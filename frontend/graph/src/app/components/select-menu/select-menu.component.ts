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

  sessionTest: Session = {
    id: "nome",
    labirintos_concluidos: ["teste1", "teste2"],
    nome: "Time vencedor",
  };

  sessionTest2: Session = {
    id: "nome",
    labirintos_concluidos: ["teste1", "teste2"],
    nome: "Sociedade do teu anel",
  };

  sessionTest3: Session = {
    id: "nome",
    labirintos_concluidos: ["teste1", "teste2"],
    nome: "Faltou um pouco de criatividade",

  };

  sessionTest4: Session = {
    id: "nome",
    labirintos_concluidos: ["teste1", "teste2"],
    nome: "Consorsio quitado",
  };

  sessionList: Session[] = [];

  eqipe1: LeaderBoardPosition = {
    index: 1,
    nome: "Time vencedor",
    pontuacao: "300",
  };

  eqipe2: LeaderBoardPosition = {
    index: 2,
    nome: "Sociedade do teu anel",
    pontuacao: "250",
  };

  eqipe3: LeaderBoardPosition = {
    index: 3,
    nome: "Faltou um pouco de criatividade",
    pontuacao: "230",
  };

  eqipe4: LeaderBoardPosition = {
    index: 3,
    nome: "Consorsio quitado",
    pontuacao: "130",
  };

  leaderBoard: LeaderBoardPosition[] = [
    this.eqipe4,
  ];

  leaderBoardTop3: LeaderBoardPosition[] = [
    this.eqipe1,
    this.eqipe2,
    this.eqipe3,
  ];



  async ngOnInit(): Promise<void> {
    // fazer requisição para pegar todas as sessões lives e placar atual
    // fazer o filter do array de top3 e resto
    for (let i = 4; i < 100; i++) {
      let epipa: LeaderBoardPosition = {
        index: i,
        nome: "teste",
        pontuacao: "1111"
      }
      this.leaderBoard.push(epipa);
    }
    await this.http.get(api + 'grupos').forEach((grupos) => {
      // @ts-ignore
      this.sessionList = grupos.Grupos;
    })
  }

  getChampsPosition(index: number) {
    if (index === 1) return 'grid-column: 2 / 3; grid-row: 1 / 2';
    if (index === 2) return 'grid-column: 3 / 4; grid-row: 2 / 3';
    if (index === 3) return 'grid-column: 1 / 2; grid-row: 3 / 4';
    return ``;
  }

  getColor(index: number) {
    let valor = index * 30 > 255? 255: index * 10;
    return `color: rgb(${valor}, 0, 0)`
  }

  goToGraph(groupName: string): void {
    this.router.navigate(["graph/" + groupName]);
  }
}
