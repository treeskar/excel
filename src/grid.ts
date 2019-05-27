import { Cell } from './cell';
import { BehaviorSubject, Subscription } from 'rxjs';
import { pairwise } from 'rxjs/operators';
import { Parser } from './parser';
import { Render } from './render';

export const CELL_ID_PATTERN = /^([A-Z])([1-9][0-9]*)$/;

export class Grid {

  private CELLS: Map<string, Cell> = new Map();
  public focused$: BehaviorSubject<Cell | null> = new BehaviorSubject(null);
  public parser: Parser;
  public render: Render;

  constructor(public element: HTMLElement) {
    this.parser = new Parser(this);
    this.render = new Render(this);

    this.focused$.pipe(
      pairwise(),
    ).subscribe(([currentCell, newCell]) => {
      if (currentCell instanceof Cell) {
        currentCell.element.removeClass('focused');
      }
      if (newCell instanceof Cell) {
        newCell.element.addClass('focused');
      }
    });
    this.focused$.next(this.getCell('A', '1'));
  }

  public getCell(x: string, y: string): Cell {
    // TODO: add x/y validation
    const cellsId = `${x}${y}`;
    if (!this.CELLS.has(cellsId)) {
      this.CELLS.set(cellsId, new Cell(this, x, y));
    }
    return this.CELLS.get(cellsId);
  }

  public getCellByElement(element: HTMLElement | null): Cell | null {
    if (!(element instanceof HTMLElement)) {
      return null;
    }
    const { x, y } = element.dataset;
    return this.getCell(x, y);
  }

}
