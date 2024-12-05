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
      Map<number, Node2d>,
      Map<number, Node3d>,
      Map<number, Node2d>,
      Map<number, Node3d>,
    ]
  > {
    let graph = this.graph.getGraph();
    let graphMap = new Map<number, Node2d>();
    let graphMap3d = new Map<number, Node3d>();

    for (let node of graph) {
      if (graphMap.has(node.VerticeId)) continue;
      let node2d: Node2d = new Node2d(node.VerticeId, node.Tipo);
      let node3d: Node3d = new Node3d(node.VerticeId, node.Tipo);
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
      this.calculateNodesPositionMatrix(this.cloneNode2dMap(graphMap)),
      this.calculateNodesPositionCircle(this.cloneNode2dMap(graphMap)),
      this.calculateNodesPositionCube(this.cloneNode3dMap(graphMap3d)),
      this.calculateNodesPositionFA2(this.cloneNode2dMap(graphMap)),
      this.calculateNodesPositionFA3D(this.cloneNode3dMap(graphMap3d)),
    ];
  }

  cloneNode2dMap(originalMap: Map<number, Node2d>): Map<number, Node2d> {
    const clonedMap = new Map<number, Node2d>();

    originalMap.forEach((node) => {
      const clonedNode = new Node2d(node.id, node.tipo);
      clonedNode.x = node.x;
      clonedNode.y = node.y;
      clonedNode.diameter = node.diameter;


      node.adList.forEach(adjNode => {
        const adjClone = clonedMap.get(adjNode.id) || new Node2d(adjNode.id, adjNode.tipo);
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
      const clonedNode = new Node3d(node.id, node.tipo);
      clonedNode.x = node.x;
      clonedNode.y = node.y;
      clonedNode.z = node.z;
      clonedNode.diameter = node.diameter;


      node.adList.forEach(adjNode => {
        const adjClone = clonedMap.get(adjNode.id) || new Node3d(adjNode.id, adjNode.tipo);
        clonedNode.adList.push(adjClone);
        clonedMap.set(adjNode.id, adjClone);
      });

      clonedMap.set(node.id, clonedNode);
    });

    return clonedMap;
  }

  calculateNodesPositionFA3D(graphMap: Map<number, Node3d>): Map<number, Node3d> {
    const attractionStrength = 0.1; // Ajuste da força de atração
    const repulsionStrength = 1000; // Ajuste da força de repulsão
    const gravity = 0.1; // Força que puxa os nós para o centro
    const maxIterations = 1000; // Número máximo de iterações
    const tolerance = 0.001; // Tolerância para estabilidade
    const speed = 1.0; // Fator de velocidade

    // Inicializar posições dos nós se não existirem
    graphMap.forEach((node) => {
      if (node.x === false || node.y === false || node.z === false) {
        node.x = Math.random() * graphMap.size * 10;
        node.y = Math.random() * graphMap.size * 10;
        node.z = Math.random() * graphMap.size * 10;
      }
    });

    let iterations = 0;
    let totalMovement = Number.MAX_VALUE;

    while (iterations < maxIterations && totalMovement > tolerance) {
      totalMovement = 0;

      // Forças de repulsão entre todos os pares de nós
      const nodesArray = Array.from(graphMap.values());
      nodesArray.forEach((node1) => {
        let fx = 0, fy = 0, fz = 0;

        nodesArray.forEach((node2) => {
          if (node1 !== node2) {
            const dx = (node2.x as number) - (node1.x as number);
            const dy = (node2.y as number) - (node1.y as number);
            const dz = (node2.z as number) - (node1.z as number);
            const distSquared = dx * dx + dy * dy + dz * dz || 0.01; // Evitar divisão por zero
            const dist = Math.sqrt(distSquared);

            // Força de repulsão
            const repulsionForce = repulsionStrength / distSquared;
            fx -= repulsionForce * (dx / dist);
            fy -= repulsionForce * (dy / dist);
            fz -= repulsionForce * (dz / dist);
          }
        });

        // Forças de atração para nós adjacentes
        node1.adList.forEach((node2) => {
          const dx = (node2.x as number) - (node1.x as number);
          const dy = (node2.y as number) - (node1.y as number);
          const dz = (node2.z as number) - (node1.z as number);
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01; // Evitar divisão por zero

          // Força de atração
          const attractionForce = attractionStrength * dist;
          fx += attractionForce * (dx / dist);
          fy += attractionForce * (dy / dist);
          fz += attractionForce * (dz / dist);
        });

        // Força gravitacional para puxar o nó para o centro
        const centerX = 0;
        const centerY = 0;
        const centerZ = 0;
        const dx = centerX - (node1.x as number);
        const dy = centerY - (node1.y as number);
        const dz = centerZ - (node1.z as number);
        const distToCenter = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;
        fx += gravity * dx / distToCenter;
        fy += gravity * dy / distToCenter;
        fz += gravity * dz / distToCenter;

        // Atualizar posição do nó
        node1.x = (node1.x as number) + fx * speed;
        node1.y = (node1.y as number) + fy * speed;
        node1.z = (node1.z as number) + fz * speed;

        // Acumular movimento total para medir estabilidade
        totalMovement += Math.sqrt(fx * fx + fy * fy + fz * fz);
      });

      iterations++;
    }

    return graphMap;
  }


  calculateNodesPositionFA2(graphMap: Map<number, Node2d>): Map<number, Node2d> {
    const attractionStrength = 0.1; // Ajuste da força de atração
    const repulsionStrength = 1000; // Ajuste da força de repulsão
    const gravity = 0.1; // Força que puxa os nós para o centro
    const maxIterations = 1000; // Número máximo de iterações
    const tolerance = 0.001; // Tolerância para estabilidade
    const speed = 1.0; // Fator de velocidade

    // Inicializar posições dos nós se não existirem
    graphMap.forEach((node) => {
      if (node.x === false || node.y === false) {
        node.x = Math.random() * graphMap.size * 10;
        node.y = Math.random() * graphMap.size * 10;
      }
    });

    let iterations = 0;
    let totalMovement = Number.MAX_VALUE;

    while (iterations < maxIterations && totalMovement > tolerance) {
      totalMovement = 0;

      // Forças de repulsão entre todos os pares de nós
      const nodesArray = Array.from(graphMap.values());
      nodesArray.forEach((node1) => {
        let fx = 0, fy = 0;

        nodesArray.forEach((node2) => {
          if (node1 !== node2) {
            const dx = (node2.x as number) - (node1.x as number);
            const dy = (node2.y as number) - (node1.y as number);
            const distSquared = dx * dx + dy * dy || 0.01; // Evitar divisão por zero
            const dist = Math.sqrt(distSquared);

            // Força de repulsão
            const repulsionForce = repulsionStrength / distSquared;
            fx -= repulsionForce * (dx / dist);
            fy -= repulsionForce * (dy / dist);
          }
        });

        // Forças de atração para nós adjacentes
        node1.adList.forEach((node2) => {
          const dx = (node2.x as number) - (node1.x as number);
          const dy = (node2.y as number) - (node1.y as number);
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01; // Evitar divisão por zero

          // Força de atração
          const attractionForce = attractionStrength * dist;
          fx += attractionForce * (dx / dist);
          fy += attractionForce * (dy / dist);
        });

        // Força gravitacional para puxar o nó para o centro
        const centerX = 0;
        const centerY = 0;
        const dx = centerX - (node1.x as number);
        const dy = centerY - (node1.y as number);
        const distToCenter = Math.sqrt(dx * dx + dy * dy) || 0.01;
        fx += gravity * dx / distToCenter;
        fy += gravity * dy / distToCenter;

        // Atualizar posição do nó
        node1.x = (node1.x as number) + fx * speed;
        node1.y = (node1.y as number) + fy * speed;

        // Acumular movimento total para medir estabilidade
        totalMovement += Math.sqrt(fx * fx + fy * fy);
      });

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

    const desiredDistance = 300;


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
