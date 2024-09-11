import { NotExpr } from '@angular/compiler';
import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as p from 'p5';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private p5Instance: any;
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  groupName: string = '';

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.createP5Instance();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.ngOnDestroy();
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    if (this.p5Instance) {
      this.p5Instance.remove();
    }
  }

  private createP5Instance(): void {
    this.p5Instance = new p(this.sketch.bind(this), this.canvasContainer.nativeElement);
  }

  private sketch(p: p) {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      p.background(200);

      // for(let i = 0; i < 30; i++) {
      //   let newNode = new Circle(p.random(0, p.width), p.random(0, p.height));
      //   if(nList.length > 0) {
      //     for(let j = 0; j < 2; j++) {
      //       let randIndex = p.floor(p.random(0, nList.length));
      //       newNode.push(nList[randIndex]);
      //       nList[randIndex].push(newNode);
      //     }

      //   }
      //   nList.push(newNode);
      // }
    };

    let nList: Circle[] = [];
    p.draw = () => {
      p.background(200);
      p.translate(-p.width / 2, -p.height / 2);
      if(p.frameCount === 200) {
        p.frameCount = 0;
      }
      if(p.frameCount === 1) {
        let newNode = new Circle(p.random(0, p.width), p.random(0, p.height));
        if(nList.length > 0) {
          let randIndex = p.floor(p.random(0, nList.length));
          newNode.push(nList[randIndex]);
          nList[randIndex].push(newNode);
        }
        nList.push(newNode);
      }

      nList.forEach((node) => {
        node.create(nList, p);
      })
    };

    p.mouseClicked = () => {
      nList.forEach((node) => {
        node.setRiple(p.mouseX, p.mouseY, p);
      });
    }
  }

  goToSelectmenu() {
    this.router.navigate(["select-menu"]).then(() => {
      this.groupName = '';
    })
  }

  goToGraph() {
    this.router.navigate(["graph/" + this.groupName]).then(() => {
      this.groupName = '';
    });
  }
}

type NodeType = 'white' | 'red' | 'orange' | 'green';

class Circle {
  constructor(
    x: number,
    y: number
  ) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;
  d: number = 20;
  tipo: NodeType = 'white';
  maxDis: number = 50;

  minSize: number = 2000;
  size: number = 0;
  ripleX: number = 0;
  ripleY: number = 0;
  public adList: Circle[] = [];

  push(node: Circle) {

    !this.adList.includes(node)? this.adList.push(node): null;

  }

  create(nList: Circle[],p: p) {
    this.drawLines(p);
    this.drawCircle(p);
    this.adList.forEach((node) => {
      this.move(node, p);
    });
    nList.forEach((node) => {
      if(node !== this) {
        this.foge(node, p);
      }
    });
    this.ripleMove(p);
    this.clip(p);
  }

  setRiple(x: number, y: number, p: p) {
    let angle = p.atan2(x - this.x, y - this.y);

    this.ripleX = (p.sin(angle) * this.minSize * -1) + this.x;
    this.ripleY = (p.cos(angle) * this.minSize * -1) + this.y;


    let scaleX = this.ripleX - this.x;
    let scaleY = this.ripleY - this.y;

    let magnitude = Math.sqrt(scaleX * scaleX + scaleY * scaleY);

    let scaleFactor = 1 / p.abs(p.dist(this.x, this.y, x, y));

    let newMagnitude = magnitude * scaleFactor;
    let newX = (newMagnitude / magnitude) * scaleX + this.x;
    let newY = (newMagnitude / magnitude) * scaleY + this.y;



    this.ripleX = newX;
    this.ripleY = newY;


    this.size = p.dist(this.x, this.y, this.ripleX, this.ripleY);
  }

  ripleMove(p: p) {
    this.size -= 1;
    if(this.size < 0) {
      this.size = 0;
      return;
    }

    const dx = this.ripleX - this.x;
    const dy = this.ripleY - this.y;

    const unitX = dx / p.abs(dx);
    const unitY = dy / p.abs(dy);

    this.x += unitX;
    this.y += unitY;
  }

  move(target: Circle, p: p) {
    const distance = p.dist(this.x, this.y, target.x, target.y);

    if(distance <= this.maxDis){
      return;
    }

    const dx = target.x - this.x;
    const dy = target.y - this.y;

    const speedFactor = distance / this.maxDis;
    const unitX = (dx / distance) * speedFactor;
    const unitY = (dy / distance) * speedFactor;

    this.x += unitX;
    this.y += unitY;
  }

  foge(target: Circle, p: p) {
    const distance = p.dist(this.x, this.y, target.x, target.y);

    if(distance >= this.maxDis){
      return;
    }

    if(distance < this.d * 2) {
      target.setRiple(this.x, this.y , p);
      // target.adList.forEach((node) => {
      //   node.setRiple(this.x, this.y , p);
      // });
    }

    const dx = target.x - this.x;
    const dy = target.y - this.y;

    const speedFactor = distance / this.maxDis;
    const unitX = (dx / distance) * speedFactor;
    const unitY = (dy / distance) * speedFactor;

    this.x -= unitX;
    this.y -= unitY;
  }

  drawCircle(p: p) {
    p.push();
    p.fill(this.tipo);
    p.stroke(0);
    p.circle(this.x, this.y, this.d);
    p.pop();
    this.clip(p);
  }

  drawLines(p: p) {
    p.push();
    p.stroke(0);
    this.adList.forEach((node) => {
      p.line(this.x, this.y, node.x, node.y);
    });
    p.pop();
  }

  clip(p: p) {
    if(this.x < 0) {
      this.x = p.width;
    } else if(this.x > p.width) {
      this.x = 0;
    }
    if(this.y < 0) {
      this.y = p.height;
    } else if(this.y > p.height) {
      this.y = 0;
    }
  }
}
