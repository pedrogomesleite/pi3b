import {Component, OnInit} from '@angular/core';
import {fetchNode} from "../node";

@Component({
  selector: 'app-graph-show',
  templateUrl: './graph-show.component.html',
  styleUrls: ['./graph-show.component.scss']
})
export class GraphShowComponent implements OnInit  {

  nodeList: fetchNode[] = [];

  ngOnInit(): void {
    for (let i = 0; i < 50; i++) {
      let node: fetchNode = {
        id: `${i}`,
        visitado: false
      }
      this.nodeList.push(node);
    }
  }
}
