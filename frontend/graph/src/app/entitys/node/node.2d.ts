import * as p from 'p5';
import {circleColor, lineColor} from "./colors";


export class Node2d {
  y: number | false = false;
  x: number | false = false;
  adList: Node2d[] = [];
  diameter: number = 20;

  id: number;

  constructor(id: number) {
    this.id = id;
  }

  drawLine(p: p) {
    this.adList.forEach(adjNode => {
      if (adjNode.x !== false && adjNode.y !== false) {
        p.stroke(lineColor);
        if (typeof this.x === "number") {
          if (typeof this.y === "number") {
            p.line(this.x, this.y, adjNode.x, adjNode.y);
          }
        }
      }
    });
  }

  drawCircle(p: p) {
    if (this.x !== false && this.y !== false) {
      p.fill(circleColor);
      p.stroke(lineColor);
      p.ellipse(this.x, this.y, this.diameter, this.diameter);
    }
  }
}

