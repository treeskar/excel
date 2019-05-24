import { delegateFromEvent } from '../tools';
import { filter, map } from 'rxjs/operators';
import { IBootstrapApp } from '../bootstrap';
import { Subscription } from 'rxjs';
import { Cell } from '../cell';

export function cellInputBehavior(app: IBootstrapApp): Subscription {
  return delegateFromEvent(app.grid.element, '.cell[contenteditable="true"]', 'input').pipe(
    filter(({ element }) => element instanceof HTMLElement),
    map(({ element }: { event: InputEvent, element: HTMLElement }) => ({
      input: element.innerText,
      cell: app.grid.getCellByElement(element),
    })),
  ).subscribe(({ input, cell }: { input: string, cell: Cell }) => {
    cell.input$.next(input);
  });
}
