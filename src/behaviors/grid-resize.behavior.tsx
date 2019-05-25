import JSX from '../jsx';
import {
  distinctUntilChanged,
  map,
  observeOn,
  pairwise,
  startWith,
} from 'rxjs/operators';
import { ALPHABET, IBootstrapApp } from '../bootstrap';
import { fromEvent, Subscription } from 'rxjs';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

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

const CELL_HEIGHT = 36;

function appendRows(container: HTMLElement, from: number, to: number) {
  container.querySelector('.cells').appendChild(createRows(from, to));
  container.querySelector('.numbers').appendChild(createYAxis(from, to));
}

function removeRows(container: HTMLElement, from: number, to: number) {
  const selector = Array.from(
    { length: to - from },
    (elm, i) => `.cell[data-y="${i + from + 1}"], .number[data-y="${i + from + 1}"]`
  ).join(', ');
  container.querySelectorAll(selector).forEach(element => element.remove());
}

export function gridResizeBehavior(app: IBootstrapApp): Subscription {
  return fromEvent(window, 'resize').pipe(
    startWith(''),
    map(() => Math.floor(app.grid.element.offsetHeight / CELL_HEIGHT)),
    distinctUntilChanged(),
    observeOn(animationFrame),
    startWith(0),
    pairwise(),
  ).subscribe(([from, to]) => {
    if (from < to) {
      appendRows(app.grid.element, from, to);
    } else if (to < from) {
      removeRows(app.grid.element, to, from);
    }
  });
}
