import { delegateFromEvent } from '../tools';
import { filter, map, pairwise, pluck, startWith, withLatestFrom } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';
import { IBootstrapApp } from '../bootstrap';
import { Cell } from '../cell';

export function cellDbClickBehavior(app: IBootstrapApp): Subscription {
  const editableCell$ = delegateFromEvent(app.grid.element, '.cell', 'dblclick').pipe(
    pluck('element'),
    map(element => app.grid.getCellByElement(element as HTMLElement)),
  );

  const subscription = editableCell$.pipe(
    startWith(null),
    pairwise(),
  ).subscribe(([previousCell, currentCell]) => {
    if (previousCell instanceof Cell) {
      previousCell.editable = false;
    }
    if (currentCell instanceof Cell) {
      currentCell.editable = true;
    }
  });

  // TODO: move editable$ stream to Grid class
  const clickSubscription = fromEvent(document.body, 'click').pipe(
    withLatestFrom(editableCell$),
    filter(([event, cell]) => cell && !(event.composedPath().includes(cell.element))),
  ).subscribe(([event, cell]) => {
    cell.editable = false;
  });

  subscription.add(clickSubscription);
  return subscription;
}

