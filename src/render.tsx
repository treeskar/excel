import JSX from './jsx';
import { Grid } from './grid';
import { CellElement } from './cellElement';
import { ALPHABET } from './bootstrap';

const CELL_HEIGHT = 36;

function createCell(x: string, y: number): HTMLElement {
  return <span className="cell" data-x={x} data-y={y} />;
}

function createRows(from: number, to: number): DocumentFragment {
  const rowsFragment = document.createDocumentFragment();
  for (let y=from; y < to; y++) {
    for (let i=0; i<ALPHABET.length; i++) {
      rowsFragment.appendChild(createCell(ALPHABET[i], y+1));
    }
  }
  return rowsFragment;
}

function createYAxis(from: number, to: number): DocumentFragment {
  const yFragment = document.createDocumentFragment();
  for (let i = from; i < to; i++) {
    yFragment.appendChild(<span className="number" data-y={i + 1}>{i + 1}</span>);
  }
  return yFragment;
}

export class Render {
  constructor(private gird: Grid) {}

  getCellElement(x: string, y: string | number): CellElement {
    return new CellElement(x, y, this.gird.element);
  }

  addRows(from: number, to: number) {
    this.gird.element.querySelector('.cells').appendChild(createRows(from, to));
    this.gird.element.querySelector('.numbers').appendChild(createYAxis(from, to));
  }

  removeRows(from: number, to: number) {
    const selector = Array.from(
      { length: to - from },
      (elm, i) => `.cell[data-y="${i + from + 1}"], .number[data-y="${i + from + 1}"]`
    ).join(', ');
    this.gird.element.querySelectorAll(selector).forEach(element => element.remove());
  }

}
