import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import p5 from 'p5';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private p5Instance: any;
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  ngOnInit(): void {
    this.createP5Instance();
  }

  ngOnDestroy(): void {
    this.p5Instance.remove();
  }

  private createP5Instance(): void {
    this.p5Instance = new p5(this.sketch.bind(this), this.canvasContainer.nativeElement);
  }


  maxDis = 100;
  visitado: NodeType = 'white';

  private sketch(p: p5) {
    let list: Circle[] = [];
    let nList: Circle[] = [];
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;
    const gridSize = 20;
    let gridBuffer: p5.Graphics;
    let showNode: Circle | null = null;
    const folha: NodeType = 'white';
    const final: NodeType = 'red';
    const caminho: NodeType = 'orange';
    const primeiro: NodeType = 'green';

    p.setup = () => {
      p.angleMode(p.DEGREES);
      p.createCanvas(2000, 2000);

      gridBuffer = p.createGraphics(p.width + gridSize, p.height + gridSize);

      this.grafoRecursivo(0, 0, 0, 0, 6, nList, p);
      for (let i = 0; i < 1000; i++) {
        let fixedNodes: Circle[] = [];
        for (let ele of nList) {
          this.moves(ele, nList);
        }
      }
      let finalIndex = Math.round(p.random(0, nList.length));
      nList[finalIndex].final = true;
      nList[finalIndex].tipo = final;
      offsetX = nList[finalIndex].x / 2;
      offsetY = nList[finalIndex].y / 2;
      p.noLoop();
      p.draw();
    };

    p.draw = () => {
      p.background(220);

      p.image(gridBuffer, offsetX % gridSize - gridSize, offsetY % gridSize - gridSize);

      p.stroke(0);
      nList[0].tipo = primeiro;
      for (let ele of nList) {
        ele.createLine(offsetX, offsetY, p);
      }

      for (let ele of nList) {
        ele.createCircle(offsetX, offsetY, p);
      }

      if (showNode) {
        p.push();
        p.stroke('yellow');
        p.fill('green');
        showNode.createLine(offsetX, offsetY, p);
        showNode.createCircle(offsetX, offsetY, p);
        p.pop();
      }
    };

    p.mousePressed = () => {
      dragging = true;
      p.loop();
    };

    p.mouseReleased = () => {
      dragging = false;
      p.noLoop();
    };

    p.mouseDragged = () => {
      if (dragging) {
        offsetX -= p.pmouseX - p.mouseX;
        offsetY -= p.pmouseY - p.mouseY;
      }
    };

    p.mouseClicked = () => {
      for (let node of nList) {
        let distancia = p.dist(node.x, node.y, p.mouseX - offsetX, p.mouseY - offsetY);
        if (distancia <= node.r / 2) {
          showNode = node;
          this.depthFirstSearch(node, nList, p);
          return;
        }
      }
    };
  }

  private grafoRecursivo(angle: number, x: number, y: number, dis: number, qtdR: number, nList: Circle[], p: p5): Circle | null {
    if (qtdR === 0) {
      return null;
    }
    qtdR = qtdR - 1;
    let newX = x + p.cos(angle) * dis;
    let newY = y + p.sin(angle) * dis;
    let node = new Circle(newX, newY, this.maxDis - 5);
    nList.push(node);
    let qtd = p.random(1, 4);
    if (dis === 0) {
      dis = this.maxDis;
    }

    for (let i = 0; i < qtd; i++) {
      let newAngle = angle + (360 / qtd) * i;
      let newNode = this.grafoRecursivo(newAngle, newX, newY, dis, qtdR, nList, p);
      if (!newNode) {
        continue;
      }
      newNode.adList.push(node);
      node.adList.push(newNode);
    }

    return node;
  }

  private moves(node: Circle, nList: Circle[]) {
    for (let ele of nList) {
      node.empurra(ele);
    }
    let fixedNodes: Circle[] = [];
    if (!fixedNodes.includes(node)) {
      fixedNodes.push(node);
      for (let adNode of node.adList) {
        if (!fixedNodes.includes(adNode)) {
          node.puxa(adNode);
          fixedNodes.push(adNode);
        }
      }
    }
  }

  private depthFirstSearch(startNode: Circle, nList: Circle[], p: p5) {
    let visited: Circle[] = [];
    let found = false;
    let nFinal: Circle | null = null;

    const dfsRecursive = (node: Circle) => {
      visited.push(node);
      if (node.final) {
        nFinal = node;
        found = true;
        return;
      }
      node.tipo = this.visitado;
      for (let neighbor of node.adList) {
        if (!visited.includes(neighbor) && !found) {
          dfsRecursive(neighbor);
        }
      }
    };

    dfsRecursive(startNode);
    if (nFinal) {
      this.aStar(startNode, nFinal, p);
    }
  }

  private aStar(startNode: Circle, finalNode: Circle, p: p5) {
    startNode.g = 0;
    startNode.h = this.heuristic(startNode, finalNode, p);
    startNode.f = startNode.g + startNode.h;

    let openSet: Circle[] = [startNode];
    let closedSet: Circle[] = [];

    while (openSet.length > 0) {
      let currentNode = this.findLowestFScore(openSet);

      if (currentNode === finalNode) {
        this.reconstructPath(currentNode);
        return;
      }

      openSet = openSet.filter(node => node !== currentNode);
      closedSet.push(currentNode);

      for (let neighbor of currentNode.adList) {
        if (closedSet.includes(neighbor)) {
          continue;
        }

        let tentativeGScore = currentNode.g + this.distance(currentNode, neighbor, p);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= neighbor.g) {
          continue;
        }

        neighbor.parent = currentNode;
        neighbor.g = tentativeGScore;
        neighbor.h = this.heuristic(neighbor, finalNode, p);
        neighbor.f = neighbor.g + neighbor.h;
      }
    }
  }

  private findLowestFScore(set: Circle[]): Circle {
    return set.reduce((lowest, node) => (node.f < lowest.f ? node : lowest));
  }

  private reconstructPath(currentNode: Circle | null) {
    let current = currentNode;
    while (current !== null) {
      current.tipo = 'orange';
      current = current.parent;
    }
  }

  private distance(nodeA: Circle, nodeB: Circle, p: p5): number {
    return p.dist(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
  }

  private heuristic(node: Circle, finalNode: Circle, p: p5): number {
    return p.dist(node.x, node.y, finalNode.x, finalNode.y);
  }
}

// Definição de tipos e classes
type NodeType = 'white' | 'red' | 'orange' | 'green';

class Circle {
  x: number;
  y: number;
  r: number;
  adList: Circle[];
  tipo: NodeType;
  final: boolean;
  g: number;
  h: number;
  f: number;
  parent: Circle | null;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.adList = [];
    this.tipo = 'white';
    this.final = false;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.parent = null;
  }

  empurra(other: Circle) {
    let d = Math.hypot(this.x - other.x, this.y - other.y);
    let overlap = this.r + other.r - d;
    if (overlap > 0) {
      let dx = (this.x - other.x) / d * overlap;
      let dy = (this.y - other.y) / d * overlap;
      this.x += dx;
      this.y += dy;
      other.x -= dx;
      other.y -= dy;
    }
  }

  puxa(other: Circle) {
    let d = Math.hypot(this.x - other.x, this.y - other.y);
    if (d > this.r + other.r) {
      let dx = (this.x - other.x) * 0.1;
      let dy = (this.y - other.y) * 0.1;
      this.x -= dx;
      this.y -= dy;
      other.x += dx;
      other.y += dy;
    }
  }

  createCircle(offsetX: number, offsetY: number, p: p5) {
    p.fill(this.tipo);
    p.stroke(0);
    p.ellipse(this.x + offsetX, this.y + offsetY, this.r);
  }

  createLine(offsetX: number, offsetY: number, p: p5) {
    for (let neighbor of this.adList) {
      p.line(this.x + offsetX, this.y + offsetY, neighbor.x + offsetX, neighbor.y + offsetY);
    }
  }
}
