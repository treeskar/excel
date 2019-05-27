import JSX from '../jsx';
import {
  distinctUntilChanged,
  map,
  observeOn,
  pairwise,
  startWith,
} from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { IBootstrapApp } from '../bootstrap';

const CELL_HEIGHT = 36;

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
      app.grid.render.addRows(from, to);
    } else if (to < from) {
      app.grid.render.removeRows(to, from);
    }
  });
}
