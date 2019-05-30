import JSX from './jsx';
import { Grid } from './grid';
import { CellElement } from './cellElement';
import { ALPHABET } from './bootstrap';
import { isNumber } from 'util';

const CELL_HEIGHT = 36;

export class Render {

  private _scrollIndex: number = 1;

  get scrollIndex() {
    return this._scrollIndex;
  }

  set scrollIndex(newIndex: number) {
    if (!Number.isInteger(newIndex) || this._scrollIndex === newIndex) {
      return;
    }
    // const delta = newIndex - this._scrollIndex;
    // if (delta > 0) {
    //
    // }
  }

  constructor(private gird: Grid) {}

  getCellElement(x: string, y: string | number): CellElement {
    return new CellElement(x, y, this.gird.element);
  }

  // TODO: support overflow content in cell. Extend cell size in edit mode.
  private createCell(x: string, y: number): HTMLElement {
    const value = this.gird.getCellInput(x, y);
    return <span className="cell" data-x={x} data-y={y} >{value}</span>;
  }

  private createRows(from: number, to: number): DocumentFragment {
    const rowsFragment = document.createDocumentFragment();
    for (let y=from; y < to; y++) {
      for (let i=0; i<ALPHABET.length; i++) {
        rowsFragment.appendChild(this.createCell(ALPHABET[i], y+1));
      }
    }
    return rowsFragment;
  }

  private createYAxis(from: number, to: number): DocumentFragment {
    const yFragment = document.createDocumentFragment();
    for (let i = from; i < to; i++) {
      yFragment.appendChild(<span className="number" data-y={i + 1}>{i + 1}</span>);
    }
    return yFragment;
  }

  addRows(from: number, to: number) {
    this.gird.element.querySelector('.cells').appendChild(this.createRows(from, to));
    this.gird.element.querySelector('.numbers').appendChild(this.createYAxis(from, to));
  }

  removeRows(from: number, to: number) {
    const selector = Array.from(
      { length: to - from },
      (elm, i) => `.cell[data-y="${i + from + 1}"], .number[data-y="${i + from + 1}"]`
    ).join(', ');
    this.gird.element.querySelectorAll(selector).forEach(element => element.remove());
  }

}
