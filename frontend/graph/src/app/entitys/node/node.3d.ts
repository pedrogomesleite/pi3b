import * as p from 'p5';
import {circleColor, circleColorFinal, circleDimColor, lineColor} from "./colors";

export class Node3d {

  z: number | false = false;
  y: number | false = false;
  x: number | false = false;
  adList: Node3d[] = [];
  diameter: number = 20;

  tipo: number = 0;

  id: number;

  constructor(id: number, tipo: number) {
    this.id = id;
    this.id = tipo;
  }

  drawLine(p: p) {
    this.adList.forEach(adjNode => {
      if (adjNode.x !== false && adjNode.y !== false && adjNode.z !== false) {
        p.stroke(lineColor);
        if (typeof this.x === "number" && typeof this.y === "number") {
          if (typeof this.z === "number") {
            if (adjNode.tipo > 0) {
              p.line(this.x, this.y, this.z, adjNode.x, adjNode.y, adjNode.z);
            }
            if (adjNode.tipo === 0 && this.tipo > 0) {
              p.fill(circleDimColor);
              p.translate(adjNode.x, adjNode.y, adjNode.z);
              p.sphere(this.diameter / 2);
            }
          }
        }
      }
    });
  }

  drawSphere(p: p) {
    if (this.x !== false && this.y !== false && this.z !== false) {
      if (this.tipo === 2) {
        p.fill(circleColorFinal);
      }
      if (this.tipo === 1) {
        p.fill(circleColor);
      }
      p.noStroke();
      p.push();
      p.translate(this.x, this.y, this.z);
      if (this.tipo > 0) {
        p.sphere(this.diameter / 2);
      }
      p.pop();
    }
  }
}
