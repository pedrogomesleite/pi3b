import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as p from 'p5';
import {Router} from "@angular/router";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  private p5Instance: any;
  @ViewChild('canvasContainer', {static: true}) canvasContainer!: ElementRef;
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
    let qtd = 40;
    let list: Circle[] = [];

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      for (let i = 0; i < qtd; i++) {
        list.push(new Circle(p));
      }
    };

    p.draw = () => {
      p.background(245);
      list.forEach((circle) => {
        circle.verify(list, p);
      });
      list.forEach((circle) => {
        circle.create(p);
      });
    };

    class Circle {
      x: number;
      y: number;
      d: number;
      xMod: number;
      yMod: number;
      minDis: number;

      constructor(p: p) {
        this.x = p.random(0, p.width);
        this.y = p.random(0, p.height);
        this.d = 12;
        this.xMod = p.random(-2, 2);
        this.yMod = p.random(-2, 2);
        this.minDis = 200;
      }

      create(p: p) {
        p.noStroke();
        p.fill(200);
        p.circle(this.x, this.y, this.d);
        this.move(p);
      }

      move(p: p) {
        this.x += this.xMod;
        this.y += this.yMod;

        if (this.x >= p.width || this.x <= 0) {
          this.xMod *= -1;
        }

        if (this.y >= p.height || this.y <= 0) {
          this.yMod *= -1;
        }
      }

      verify(list: Circle[], p: p) {
        list.forEach((circle) => {
          let disOutro = p.dist(this.x, this.y, circle.x, circle.y);
          p.stroke(p.map(disOutro, 0, this.minDis, 200, 245));
          if (disOutro < this.minDis) {
            p.line(this.x, this.y, circle.x, circle.y);
          }

          let disMouse = p.dist(this.x, this.y, p.mouseX, p.mouseY);
          p.stroke(p.map(disMouse, 0, this.minDis, 200, 245));
          if (disMouse < this.minDis) {
            p.line(this.x, this.y, p.mouseX, p.mouseY);
          }
        });
      }
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
