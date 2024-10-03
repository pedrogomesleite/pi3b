import {Component, OnInit} from '@angular/core';
import {GraphService, Type} from "../../../services/graph.manipulation.service";
import {NodeDto} from "../../../entitys/node/node.dto";
import {SharedGraphService} from "../../../services/shared-graph.service";

@Component({
  selector: 'app-graph-show',
  templateUrl: './graph-show.component.html',
  styleUrls: ['./graph-show.component.scss']
})
export class GraphShowComponent implements OnInit {

  constructor(
    private graphService: GraphService,
    private graph: SharedGraphService,
  ) {
  }

  ngOnInit(): void {
    this.fetchGrafo().then(r => {
      this.graphService.returnNodeMap(Type.kk2d);
      console.log(this.graph.getGraph());
    });
  }

  // pega o grafo do backend
  async fetchGrafo() {
    this.graph.setGraph(this.generateRandomGraph(20, 3, 1));
  }

  generateRandomGraph(numVertices: number, maxAdjacencias: number, labirintoId: number): NodeDto[] {
    const graph: NodeDto[] = [];

    for (let i = 0; i < numVertices; i++) {
      const numAdjacencias = Math.floor(Math.random() * (maxAdjacencias + 1));
      const adjacencias: number[] = [];

      while (adjacencias.length < numAdjacencias) {
        const randomAdj = Math.floor(Math.random() * numVertices);

        if (randomAdj !== i && !adjacencias.includes(randomAdj)) {
          adjacencias.push(randomAdj);
        }
      }

      const tipo = Math.floor(Math.random() * 2);

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
