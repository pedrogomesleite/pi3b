import {NodeDto} from "../entitys/node/node.dto";
import {Injectable} from "@angular/core";

@Injectable()
export class SharedGraphService {
  private array: NodeDto[] = [];

  constructor() {}

  getGraph(): NodeDto[] {
    return this.array;
  }

  setGraph(newArray: NodeDto[]): void {
    this.array = newArray;
  }
}
