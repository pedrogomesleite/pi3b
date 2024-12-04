import {Component, OnInit} from '@angular/core';
import {GraphService} from "../../../services/graph.manipulation.service";
import {NodeDto} from "../../../entitys/node/node.dto";
import {SharedGraphService} from "../../../services/shared-graph.service";
import {MatExpansionModule} from '@angular/material/expansion';
import {Node2d} from "../../../entitys/node/node.2d";
import {Config2d} from "./config/2d-config";
import {Node3d} from "../../../entitys/node/node.3d";
import {Config3d} from "./config/3d-config";
import {NgIf} from "@angular/common";
import {MatChipsModule} from "@angular/material/chips";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-graph-show',
  templateUrl: './graph-show.component.html',
  styleUrls: ['./graph-show.component.scss'],
  standalone: true,
  imports: [MatExpansionModule, Config2d, Config3d, NgIf, MatChipsModule]
})
export class GraphShowComponent implements OnInit {

  constructor(
    private graphService: GraphService,
    private graph: SharedGraphService,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
  }

  show = {
    matrix2d: false,
    circle2d: false,
    matrix3d: false,
    fa22D: true,
    fa23D: false,
  }

  matrix2DMap?: Map<number, Node2d>;
  circle2DMap?: Map<number, Node2d>;
  matrix3DMap?: Map<number, Node3d>;
  fa22DMap?: Map<number, Node2d>;
  fa23DMap?: Map<number, Node3d>;

  mapList: (Map<number, Node3d | Node2d> | undefined)[] = [];

  nome?: string;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nome = params['nome'];
    });
    this.fetchGrafo().then(async r => {
      [this.matrix2DMap, this.circle2DMap, this.matrix3DMap, this.fa22DMap, this.fa23DMap] = await this.graphService.returnNodeMapList();
    });
    this.mapList = [this.matrix2DMap, this.circle2DMap, this.matrix3DMap, this.fa22DMap, this.fa23DMap];
  }


  async fetchGrafo() {
    console.log(this.nome);

    this.graph.setGraph(this.generateRandomGraph(100, 3, 1));
  }

  generateRandomGraph(numVertices: number, maxAdjacencias: number, labirintoId: number): NodeDto[] {
    const graph: NodeDto[] = [];

    for (let i = 0; i < numVertices; i++) {
      let numAdjacencias = Math.floor(Math.random() * (maxAdjacencias + 1));
      const adjacencias: number[] = [];
      numAdjacencias = numAdjacencias === 0 ? 1 : numAdjacencias;
      while (adjacencias.length < numAdjacencias) {
        const randomAdj = Math.floor(Math.random() * numVertices);

        if (randomAdj !== i && !adjacencias.includes(randomAdj)) {
          adjacencias.push(randomAdj);
        }
      }

      const tipo = 0;

      const node: NodeDto = {
        VerticeId: i,
        Adjacencia: adjacencias,
        Tipo: tipo,
        LabirintoId: labirintoId
      };

      graph.push(node);
    }

    return graph;
  }

  selectOption(key:  'matrix2d' | 'circle2d' | 'matrix3d' | 'fa22D' | 'fa23D'): void {

    if (this.show[key]) return;

    this.show.matrix2d = false;
    this.show.circle2d = false;
    this.show.matrix3d = false;
    this.show.fa22D = false;
    this.show.fa23D = false;

    this.show[key] = true;
  }
}
