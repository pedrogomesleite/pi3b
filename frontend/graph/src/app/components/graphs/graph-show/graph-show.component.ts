import {Component, OnInit} from '@angular/core';
import {GraphService, Type} from "../../../services/graph.manipulation.service";
import {NodeDto} from "../../../entitys/node/node.dto";
import {SharedGraphService} from "../../../services/shared-graph.service";
import { MatExpansionModule } from '@angular/material/expansion';
import {Node2d} from "../../../entitys/node/node.2d";

@Component({
    selector: 'app-graph-show',
    templateUrl: './graph-show.component.html',
    styleUrls: ['./graph-show.component.scss'],
    standalone: true,
    imports: [MatExpansionModule]
})
export class GraphShowComponent implements OnInit {

  constructor(
    private graphService: GraphService,
    private graph: SharedGraphService,
  ) {
  }

  kk2DMap?: Map<number, Node2d>;

  ngOnInit(): void {
    this.fetchGrafo().then(async r => {
      this.kk2DMap = await this.graphService.returnNodeMap(Type.kk2d);
    });
  }

  // pega o grafo do backend
  async fetchGrafo() {
    this.graph.setGraph(this.generateRandomGraph(20, 3, 1));
  }

  generateRandomGraph(numVertices: number, maxAdjacencias: number, labirintoId: number): NodeDto[] {
    const graph: NodeDto[] = [];

    for (let i = 0; i < numVertices; i++) {
      let numAdjacencias = Math.floor(Math.random() * (maxAdjacencias + 1));
      const adjacencias: number[] = [];
      numAdjacencias = numAdjacencias === 0? 1: numAdjacencias;
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
}
