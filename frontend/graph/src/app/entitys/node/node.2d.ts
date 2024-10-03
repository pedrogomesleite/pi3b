import * as p from 'p5';


export class Node2d {

  y: number | false = false;
  x: number | false = false;
  adList: Node2d[] = [];

  id: number;

  constructor(id: number) {
    this.id = id;
  }


}
