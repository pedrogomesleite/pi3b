import { Component, OnInit } from '@angular/core';
import { GraphService } from "../../../services/graph.manipulation.service";
import { NodeDto } from "../../../entitys/node/node.dto";
import { SharedGraphService } from "../../../services/shared-graph.service";
import { MatExpansionModule } from '@angular/material/expansion';
import { Node2d } from "../../../entitys/node/node.2d";
import { Config2d } from "./config/2d-config";
import { Node3d } from "../../../entitys/node/node.3d";
import { Config3d } from "./config/3d-config";
import { NgForOf, NgIf } from "@angular/common";
import { MatChipsModule } from "@angular/material/chips";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { api } from "../../../api";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-graph-show',
  templateUrl: './graph-show.component.html',
  styleUrls: ['./graph-show.component.scss'],
  standalone: true,
  imports: [MatExpansionModule, Config2d, Config3d, NgIf, MatChipsModule, MatProgressSpinnerModule, NgForOf]
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

  id?: string;
  nome?: string;
  labirinto_id?: number;
  status: any[] = [];

  private websocket: WebSocket | undefined;

  processing: boolean = true;

  async ngOnInit(): Promise<void> {
    this.graph.setGraph([]);
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.nome = params['nome'];
    });
    this.fetchGrafo().then();

    await this.http.get<any>(api + 'placar/' + this.id).forEach((placar) => {
      console.log(placar);

      this.status = placar.labirintos;
      console.log(this.status);
    });
  }

  sessionId?: number;
  async fetchGrafo() {
    await this.http.get<Object[]>(api + 'sessoes').forEach((sessoes: any[]) => {
      for (let sesso of sessoes) {
        if (sesso['grupo_id'] === this.id) {
          this.sessionId = sesso['id'];
          this.connectWebSocket(sesso['conexao'],);
        }
      }
    }).catch(() => {
      window.alert("Websocket closed!");
    });
  }

  async connectWebSocket(conexao: string) {
    console.log(conexao + 0)
    this.websocket = new WebSocket(conexao + `?session_id=${this.sessionId}&observer=true`);

    this.websocket.onopen = () => {
      this.websocket?.send('labirinto');
    };

    this.websocket.onmessage = async (event) => {
      const data = event.data;

      console.log('Mensagem recebida:', data);
      const dataString: string = event.data;
      if (dataString.includes("Labirinto atual: ")) {
        this.labirinto_id = Number(dataString.replace("Labirinto atual: ", ""));
        await this.http.get<Object[]>(api + 'labirintos/' + this.labirinto_id + '/arestas').forEach(async (nodes: any[]) => {
          const nodesMap = new Map<number, NodeDto>();

          for (let node of nodes) {
            const origem = node.origem;
            const destino = node.destino;

            if (nodesMap.has(origem)) {
              nodesMap.get(origem)?.Adjacencia.push(destino);
            } else {
              nodesMap.set(origem, {
                VerticeId: origem,
                Adjacencia: [destino],
                Tipo: 0,
              });
            }
          }

          const nodeList: NodeDto[] = Array.from(nodesMap.values());
          this.graph.setGraph(nodeList);
          [this.matrix2DMap, this.circle2DMap, this.matrix3DMap, this.fa22DMap, this.fa23DMap] = await this.graphService.returnNodeMapList();
          this.mapList = [this.matrix2DMap, this.circle2DMap, this.matrix3DMap, this.fa22DMap, this.fa23DMap];
          this.processing = false;
          console.log(this.matrix2DMap);
          this.websocket?.send('historico');
          setInterval(() => {
            this.websocket?.send('historico');
          }, 3000);

        }).then();
      }

      console.log({ dataString })
      if (dataString.startsWith("[")) {
        console.log(dataString)

        const list: number[] = JSON.parse(dataString);

        for (const listKey in list) {
          this.mapList.forEach((list?: Map<number, Node2d | Node3d>) => {
            if (list) {
              let item = list.get(Number(listKey));
              if (item) {
                item.tipo = 1;
              }
            }
          })
        }


      }
    };

    this.websocket.onerror = (error) => {
      console.error('Erro WebSocket:', error);
    };

    this.websocket.onclose = () => {
      console.log('Conexão WebSocket fechada.');
    };
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
      };

      graph.push(node);
    }

    return graph;
  }

  selectOption(key: 'matrix2d' | 'circle2d' | 'matrix3d' | 'fa22D' | 'fa23D'): void {

    if (this.show[key]) return;

    this.show.matrix2d = false;
    this.show.circle2d = false;
    this.show.matrix3d = false;
    this.show.fa22D = false;
    this.show.fa23D = false;

    this.show[key] = true;
  }
}
