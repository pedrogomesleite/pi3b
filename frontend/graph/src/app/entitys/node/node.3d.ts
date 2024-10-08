import * as p from 'p5';
import { circleColor, lineColor } from "./colors";

export class Node3d {

  z: number | false = false;
  y: number | false = false;
  x: number | false = false;
  adList: Node3d[] = [];
  diameter: number = 20;

  id: number;

  constructor(id: number) {
    this.id = id;
  }

  drawLine(p: p) {
    this.adList.forEach(adjNode => {
      if (adjNode.x !== false && adjNode.y !== false && adjNode.z !== false) {
        p.stroke(lineColor);
        if (typeof this.x === "number" && typeof this.y === "number") {
          if (typeof this.z === "number") {
            p.line(this.x, this.y, this.z, adjNode.x, adjNode.y, adjNode.z);
          }
        }
      }
    });
  }

  drawSphere(p: p) {
    if (this.x !== false && this.y !== false && this.z !== false) {
      p.fill(circleColor);
      p.noStroke();
      p.push();
      p.translate(this.x, this.y, this.z);
      p.sphere(this.diameter / 2);
      p.pop();
    }
  }
}
