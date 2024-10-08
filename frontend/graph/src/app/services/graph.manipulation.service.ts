import {SharedGraphService} from "./shared-graph.service";
import {Node2d} from "../entitys/node/node.2d";
import {Injectable} from "@angular/core";
import {Node3d} from "../entitys/node/node.3d";

@Injectable()
export class GraphService {

  constructor(
    private graph: SharedGraphService,
  ) {

  }

  async returnNodeMapList(): Promise<
    [
      Map<number, Node2d>,
      Map<number, Node3d>,
      Map<number, Node2d>,
      Map<number, Node2d>,
      Map<number, Node3d>,
    ]
  > {
    let graph = this.graph.getGraph();
    let graphMap = new Map<number, Node2d>();
    let graphMap3d = new Map<number, Node3d>();

    for (let node of graph) {
      if (graphMap.has(node.VerticeId)) continue;
      let node2d: Node2d = new Node2d(node.VerticeId);
      let node3d: Node3d = new Node3d(node.VerticeId);
      for (let adNode of node.Adjacencia) {
        if (graphMap.has(adNode)) {
          node2d.adList.push(graphMap.get(adNode)!);
          node3d.adList.push(graphMap3d.get(adNode)!);
        }
      }
      graphMap.set(node.VerticeId, node2d);
      graphMap3d.set(node.VerticeId, node3d);
    }

    return [
      this.calculateNodesPositionKK2D(this.cloneNode2dMap(graphMap)),
      this.calculateNodesPositionKK3D(this.cloneNode3dMap(graphMap3d)),
      this.calculateNodesPositionMatrix(this.cloneNode2dMap(graphMap)),
      this.calculateNodesPositionCircle(this.cloneNode2dMap(graphMap)),
      this.calculateNodesPositionCube(this.cloneNode3dMap(graphMap3d)),
    ];
  }

  cloneNode2dMap(originalMap: Map<number, Node2d>): Map<number, Node2d> {
    const clonedMap = new Map<number, Node2d>();

    originalMap.forEach((node) => {
      const clonedNode = new Node2d(node.id);
      clonedNode.x = node.x;
      clonedNode.y = node.y;
      clonedNode.diameter = node.diameter;


      node.adList.forEach(adjNode => {
        const adjClone = clonedMap.get(adjNode.id) || new Node2d(adjNode.id);
        clonedNode.adList.push(adjClone);
        clonedMap.set(adjNode.id, adjClone);
      });

      clonedMap.set(node.id, clonedNode);
    });

    return clonedMap;
  }


  cloneNode3dMap(originalMap: Map<number, Node3d>): Map<number, Node3d> {
    const clonedMap = new Map<number, Node3d>();

    originalMap.forEach((node) => {
      const clonedNode = new Node3d(node.id);
      clonedNode.x = node.x;
      clonedNode.y = node.y;
      clonedNode.z = node.z;
      clonedNode.diameter = node.diameter;


      node.adList.forEach(adjNode => {
        const adjClone = clonedMap.get(adjNode.id) || new Node3d(adjNode.id);
        clonedNode.adList.push(adjClone);
        clonedMap.set(adjNode.id, adjClone);
      });

      clonedMap.set(node.id, clonedNode);
    });

    return clonedMap;
  }


  calculateNodesPositionKK2D(graphMap: Map<number, Node2d>): Map<number, Node2d> {
    const L0 = 100;
    const K = 0.05;
    const minDistance = 50;

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

      const nodesArray = Array.from(graphMap.values());
      for (let i = 0; i < nodesArray.length; i++) {
        for (let j = i + 1; j < nodesArray.length; j++) {
          const dist = calcDistance(nodesArray[i], nodesArray[j]);
          if (dist < minDistance) {
            const penalty = 0.5 * K * (minDistance - dist) * (minDistance - dist);
            totalEnergy += penalty;
          }
        }
      }

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
    return graphMap;
  }

  calculateNodesPositionKK3D(graphMap: Map<number, Node3d>): Map<number, Node3d> {
    const L0 = 100;
    const K = 0.05;
    const minDistance = 50;

    graphMap.forEach((node) => {
      if (node.x === false || node.y === false || node.z === false) {
        node.x = Math.random() * 1000;
        node.y = Math.random() * 1000;
        node.z = Math.random() * 1000;
      }
    });

    let energy = Number.MAX_VALUE;
    const tolerance = 0.001;
    let iterations = 0;
    const maxIterations = 1000;

    function calcDistance(node1: Node3d, node2: Node3d): number {
      const dx = (node2.x as number) - (node1.x as number);
      const dy = (node2.y as number) - (node1.y as number);
      const dz = (node2.z as number) - (node1.z as number);
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
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

      const nodesArray = Array.from(graphMap.values());
      for (let i = 0; i < nodesArray.length; i++) {
        for (let j = i + 1; j < nodesArray.length; j++) {
          const dist = calcDistance(nodesArray[i], nodesArray[j]);
          if (dist < minDistance) {
            const penalty = 0.5 * K * (minDistance - dist) * (minDistance - dist);
            totalEnergy += penalty;
          }
        }
      }

      return totalEnergy;
    }

    function adjustPositions() {
      graphMap.forEach((node1) => {
        let fx = 0;
        let fy = 0;
        let fz = 0;

        node1.adList.forEach((node2: Node3d) => {
          const dist = calcDistance(node1, node2);
          if (dist > 0) {
            const deltaX = (node2.x as number) - (node1.x as number);
            const deltaY = (node2.y as number) - (node1.y as number);
            const deltaZ = (node2.z as number) - (node1.z as number);
            const force = K * (dist - L0) / dist;

            fx += force * deltaX;
            fy += force * deltaY;
            fz += force * deltaZ;
          }
        });

        node1.x = (node1.x as number) + fx;
        node1.y = (node1.y as number) + fy;
        node1.z = (node1.z as number) + fz;
      });
    }

    while (energy > tolerance && iterations < maxIterations) {
      adjustPositions();
      energy = calcEnergy();
      iterations++;
    }

    return graphMap;
  }


  calculateNodesPositionMatrix(graphMap: Map<number, Node2d>): Map<number, Node2d> {
    const totalNodes = graphMap.size;
    const sideLength = Math.ceil(Math.sqrt(totalNodes));
    const spacing = 50;

    let rowIndex = 0;
    let colIndex = 0;


    graphMap.forEach((node, id) => {

      node.x = colIndex * spacing;
      node.y = rowIndex * spacing;


      colIndex++;

      if (colIndex >= sideLength) {
        colIndex = 0;
        rowIndex++;
      }
    });

    return graphMap;
  }

  calculateNodesPositionCircle(graphMap: Map<number, Node2d>): Map<number, Node2d> {
    const totalNodes = graphMap.size;


    const desiredDistance = 30;


    const circumference = totalNodes * desiredDistance;
    const radius = circumference / (2 * Math.PI);

    let angleIncrement = (2 * Math.PI) / totalNodes;

    let index = 0;

    graphMap.forEach((node) => {

      const angle = index * angleIncrement;
      node.x = radius * Math.cos(angle);
      node.y = radius * Math.sin(angle);

      index++;
    });

    return graphMap;
  }

  calculateNodesPositionCube(graphMap: Map<number, Node3d>): Map<number, Node3d> {
    const totalNodes = graphMap.size;

    const desiredDistance = 150;


    const cubeSize = Math.ceil(Math.cbrt(totalNodes)) * desiredDistance;

    const spacing = cubeSize / Math.ceil(Math.cbrt(totalNodes));

    let index = 0;


    const dimensionCount = Math.ceil(Math.cbrt(totalNodes));

    graphMap.forEach((node) => {

      const xIndex = index % dimensionCount;
      const yIndex = Math.floor((index / dimensionCount) % dimensionCount);
      const zIndex = Math.floor(index / (dimensionCount * dimensionCount));

      node.x = xIndex * spacing - (cubeSize / 2);
      node.y = yIndex * spacing - (cubeSize / 2);
      node.z = zIndex * spacing - (cubeSize / 2);

      index++;
    });

    return graphMap;
  }


  calculateNodesPositionSpiral(): void {

  }
}
