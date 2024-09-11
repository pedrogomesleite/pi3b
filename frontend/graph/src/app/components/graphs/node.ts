import * as p from "p5";

export abstract class node {
  id: string;
  x: number;
  y: number;
  z: number;
  d: number;
  visitado: boolean;
  adList: node[];

  constructor(id: string,x:number, y: number, z: number, d: number, visitado: boolean, adList: node[]) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.d = d;
    this.visitado = visitado;
    this.adList = adList;
    this.id = id;
  }

  abstract drawNode(p: p): void;
  abstract drawArestas(p: p): void;
}

export interface fetchNode {
  visitado: boolean;
  id: string;
}
