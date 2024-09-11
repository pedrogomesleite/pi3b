import {Component, OnInit} from '@angular/core';
import {LeaderBoardPosition, Session} from "../../entitys/session-entitys";
import {Router} from "@angular/router";

@Component({
  selector: 'app-select-menu',
  templateUrl: 'select-menu.component.html',
  styleUrls: ['./select-menu.component.scss']
})
export class SelectMenuComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
  }

  sessionTest: Session = {
    qtdlabirintoSolucionados: 1,
    labirintoAtualDescricao: "O labirinto mais traquilinho já visto",
    nome: "Time vencedor",
    tempo: "05:25:12",
    pontuacao: "300",
  };

  sessionTest2: Session = {
    qtdlabirintoSolucionados: 21,
    labirintoAtualDescricao: "O labirinto mais traquilinho já visto",
    nome: "Sociedade do teu anel",
    tempo: "03:20:34",
    pontuacao: "250",
  };

  sessionTest3: Session = {
    qtdlabirintoSolucionados: 5,
    labirintoAtualDescricao: "O labirinto mais traquilinho já visto",
    nome: "Faltou um pouco de criatividade",
    tempo: "20:00:07",
    pontuacao: "230",
  };

  sessionTest4: Session = {
    qtdlabirintoSolucionados: 10,
    labirintoAtualDescricao: "O labirinto mais traquilinho já visto",
    nome: "Consorsio quitado",
    tempo: "01:10:59",
    pontuacao: "130",
  };

  sessionList: Session[] = [
    this.sessionTest,
    this.sessionTest2,
    this.sessionTest3,
    this.sessionTest4,
  ];

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



  ngOnInit(): void {
    // fazer requisição para pegar todas as sessões lives e placar atual
    // fazer o filter do array de top3 e resto
    for(let i = 4; i < 100; i++) {
      let epipa: LeaderBoardPosition = {
        index: i,
        nome: "teste",
        pontuacao: "1111"
      }
      this.leaderBoard.push(epipa);
    }
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
