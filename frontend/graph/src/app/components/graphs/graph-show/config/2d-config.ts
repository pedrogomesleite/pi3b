import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import * as p5 from 'p5';
import {Node2d} from "../../../../entitys/node/node.2d";
import {Node3d} from "../../../../entitys/node/node.3d";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-config-2d',
  template: '<div #canvasContainer style="width: 100%; height: 100vh;"></div> <mat-spinner *ngIf="nList"></mat-spinner>',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    NgIf
  ]
})
export class Config2d implements OnInit {
  @Input() nList?: Map<number, Node2d>;

  private p5Instance: any;

  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  private offsetX = 0;
  private offsetY = 0;
  private dragging = false;
  private startX = 0;
  private startY = 0;

  ngOnInit(): void {
    this.createP5Instance();
  }

  private createP5Instance(): void {
    this.p5Instance = new p5(this.sketch.bind(this), this.canvasContainer.nativeElement);
  }

  private sketch(p: p5) {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(200);
      p.noLoop();
    };

    p.draw = () => {
      p.background(200);

      p.translate(this.offsetX, this.offsetY);
      this.nList?.forEach((node) => {
        node.drawLine(p);
      });
      this.nList?.forEach((node) => {
        node.drawCircle(p);
      });
    };

    p.mousePressed = () => {
      this.startX = p.mouseX - this.offsetX;
      this.startY = p.mouseY - this.offsetY;
      this.dragging = true;
    };

    p.mouseDragged = () => {
      if (this.dragging) {
        this.offsetX = p.mouseX - this.startX;
        this.offsetY = p.mouseY - this.startY;
        p.redraw();
      }
    };

    p.mouseReleased = () => {
      this.dragging = false;
      p.redraw();
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      p.redraw();
    };
  }
}
