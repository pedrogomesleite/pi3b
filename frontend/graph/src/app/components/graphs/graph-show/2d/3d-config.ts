import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import * as p5 from 'p5';
import { Node3d } from "../../../../entitys/node/node.3d";

@Component({
  selector: 'app-config-3d',
  template: '<div #canvasContainer style="width: 100%; height: 100vh;"></div>',
  standalone: true,
  imports: []
})
export class Config3d implements OnInit {
  @Input() nList?: Map<number, Node3d>;

  private p5Instance: any;
  private cam?: p5.Camera;

  private lastMouseX?: number;
  private lastMouseY?: number;

  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  ngOnInit(): void {
    this.createP5Instance();
  }

  private createP5Instance(): void {
    this.p5Instance = new p5(this.sketch.bind(this), this.canvasContainer.nativeElement);
  }

  private sketch(p: p5) {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);

      if (this.nList && this.nList.size > 0) {
        const firstNode = this.nList.values().next().value;

        this.cam = p.createCamera();
        this.cam.setPosition(0, 0, 400);
        this.cam.lookAt(firstNode.x, firstNode.y, firstNode.z);
      }
      p.orbitControl();
      p.background(200);
    };

    p.draw = () => {
      p.background(200);

      if (p.keyIsPressed) {
        const speed = 10;
        if (!this.cam) return;
        if (p.key === 'w') {
          this.cam.move(0, 0, -speed);
        }
        if (p.key === 's') {
          this.cam.move(0, 0, speed);
        }
        if (p.key === 'a') {
          this.cam.move(-speed, 0, 0);
        }
        if (p.key === 'd') {
          this.cam.move(speed, 0, 0);
        }
        if (p.key === 'e') {
          this.cam.move(0, -speed, 0);
        }
        if (p.key === 'q') {
          this.cam.move(0, speed, 0);
        }
      }

      // Desenhar os nós
      this.nList?.forEach((node) => {
        node.drawLine(p);
      });

      this.nList?.forEach((node) => {
        node.drawSphere(p);
      });
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.mousePressed = () => {
      this.lastMouseX = p.mouseX;
      this.lastMouseY = p.mouseY;
    };

    p.mouseDragged = () => {
      if (this.cam) {
        const deltaX = p.mouseX - (this.lastMouseX ?? 0);
        const deltaY = p.mouseY - (this.lastMouseY ?? 0);

        // Ajustar a direção da câmera com base no movimento do mouse
        const sensitivity = 0.005; // Ajuste este valor para controlar a sensibilidade
        this.cam.pan(-deltaX * sensitivity); // Multiplique para ajustar a sensibilidade
        this.cam.tilt(deltaY * sensitivity); // Multiplique para ajustar a sensibilidade

        // Atualizar a última posição do mouse
        this.lastMouseX = p.mouseX;
        this.lastMouseY = p.mouseY;
      }
    };
  }
}
