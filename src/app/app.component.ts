import { Component, OnInit } from '@angular/core';
import { CELLS } from './mock-grid';
import { COLORS } from './mock-toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /*saved grid */
  cells = CELLS;

  /* toolbar */
  colors = COLORS;

  /* grid size */
  private rows = 4;
  private cols = 4;

  /*dropped color*/
  public currColor;

  message: string;

  constructor() {
  }

  ngOnInit() {
    /* init new grid */
    this.cells = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.cells[i] = new Array(this.cols);
    }
  }

  parseColor(rgb) {
    return rgb.match(/\d+/ig);
  }

  blendColors(a, b) {
    const blended = [];
    for (let i = 0; i < 3; i++) {
      const first = Number(this.parseColor(a)[i]),
            second = Number(this.parseColor(b)[i]);
      blended[i] = Math.round((first + second) / 2);
    }
    return 'rgb(' + blended[0] + ',' + blended[1] + ',' + blended[2] + ')';
  }

  dragStartHandler(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', e.target.style.backgroundColor);
    this.currColor = e.target.style.backgroundColor;
  }

  dropHandler(e, i, j) {
    e.preventDefault();

    if (!this.cells[i][j]) {
      this.cells[i][j] = this.currColor;
    } else {
      this.cells[i][j] = this.blendColors(this.cells[i][j], this.currColor);
    }
    return false;
  }

  allowDropHandler(e) {
    e.preventDefault();
    return false;
  }

  saveGrid() {
    const grid = JSON.stringify(this.cells);
    localStorage.setItem('myGrid', grid);
    if (localStorage.getItem('myGrid') === grid) {
      this.message = 'Saved!';
    }
  }

  loadGrid() {
    const grid = localStorage.getItem('myGrid');
    if (!grid) {
      this.message = 'Nothing to load!';
      return;
    }
    this.cells = JSON.parse(grid);

  }

  showSavedGrid() {
    this.message = localStorage.getItem('myGrid') || 'Nothing was saved!';
  }
}
