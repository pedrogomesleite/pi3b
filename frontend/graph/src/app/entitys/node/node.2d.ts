import * as p from 'p5';
import {circleColor, circleColorFinal, circleDimColor, lineColor} from "./colors";


export class Node2d {
  y: number | false = false;
  x: number | false = false;
  adList: Node2d[] = [];
  diameter: number = 20;
  tipo: number = 0;
  id: number;

  constructor(id: number, tipo: number) {
    this.id = id;
    this.tipo = tipo;
  }

  drawLine(p: p) {
    this.adList.forEach(adjNode => {
      if (adjNode.x !== false && adjNode.y !== false) {
        p.stroke(lineColor);
        if (typeof this.x === "number") {
          if (typeof this.y === "number") {
            if (adjNode.tipo > 0) {
              p.line(this.x, this.y, adjNode.x, adjNode.y);
            }
            if (adjNode.tipo === 0 && this.tipo > 0) {
              p.fill(circleDimColor);
              p.ellipse(adjNode.x, adjNode.y, this.diameter, this.diameter);
            }
          }
        }
      }
    });
  }

  drawCircle(p: p) {
    if (this.x !== false && this.y !== false) {
      if (this.tipo === 2) {
        p.fill(circleColorFinal);
      }
      if (this.tipo === 1) {
        p.fill(circleColor);
      }
      p.fill(circleColor);
      p.stroke(lineColor);
      if (this.tipo > 0){
        p.ellipse(this.x, this.y, this.diameter, this.diameter);
      }
    }
  }
}

