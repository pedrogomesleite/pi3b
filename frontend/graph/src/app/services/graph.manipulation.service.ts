import {SharedGraphService} from "./shared-graph.service";
import {Node2d} from "../entitys/node/node.2d";
import {Injectable} from "@angular/core";

@Injectable()
export class GraphService {

  constructor(
    private graph: SharedGraphService,
  ) {

  }

  async returnNodeMap(type: Type): Promise<Map<number, Node2d>> {
    let graph = this.graph.getGraph();
    let graphMap = new Map();
    for (let node of graph) {
      if (graphMap.has(node.VerticeId)) continue;
      let node2d: Node2d = new Node2d(node.VerticeId);
      for(let adNode of node.Adjacencia) {
        if(graphMap.has(adNode)) node2d.adList.push(graphMap.get(adNode));
      }
      graphMap.set(node.VerticeId, node2d);
    }
    if (type === Type.kk2d) {
      this.calculateNodesPositionKK2D(graphMap);
    } else if (type === Type.matrix) {

    }
    return graphMap;
  }

  calculateNodesPositionKK2D(graphMap: Map<number, Node2d>): void {
    const L0 = 100;
    const K = 0.1;

    graphMap.forEach((node) => {
      if (node.x === false || node.y === false) {
        node.x = Math.random() * 1000;
        node.y = Math.random() * 1000;
      }
    });

    let energy = Number.MAX_VALUE;
    const tolerance = 0.001;
    let iterations = 0;
    const maxIterations = 1000;

    function calcDistance(node1: Node2d, node2: Node2d): number {
      const dx = (node2.x as number) - (node1.x as number);
      const dy = (node2.y as number) - (node1.y as number);
      return Math.sqrt(dx * dx + dy * dy);
    }

    function calcEnergy(): number {
      let totalEnergy = 0;
      graphMap.forEach((node1) => {
        node1.adList.forEach((node2) => {
          const dist = calcDistance(node1, node2);
          const delta = dist - L0;
          totalEnergy += 0.5 * K * delta * delta;
        });
      });
      return totalEnergy;
    }

    function adjustPositions() {
      graphMap.forEach((node1) => {
        let fx = 0;
        let fy = 0;

        node1.adList.forEach((node2) => {
          const dist = calcDistance(node1, node2);
          if (dist > 0) {
            const deltaX = (node2.x as number) - (node1.x as number);
            const deltaY = (node2.y as number) - (node1.y as number);
            const force = K * (dist - L0) / dist;

            fx += force * deltaX;
            fy += force * deltaY;
          }
        });

        node1.x = (node1.x as number) + fx;
        node1.y = (node1.y as number) + fy;
      });
    }

    while (energy > tolerance && iterations < maxIterations) {
      adjustPositions();
      energy = calcEnergy();
      iterations++;
    }
  }

  calculateNodesPositionKK3D(): void {

  }

  calculateNodesPositionMatrix(): void {

  }

  calculateNodesPositionSpiral(): void {

  }
}

export enum Type {
  kk2d,
  kk3d,
  matrix,
  spiral,
}
