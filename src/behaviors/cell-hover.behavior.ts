import { Subscription } from 'rxjs';
import { distinctUntilChanged, map, pairwise, pluck, startWith } from 'rxjs/operators';
import { delegateFromEvent } from '../tools';
import { IBootstrapApp } from '../bootstrap';

export function cellHoverBehavior(app: IBootstrapApp): Subscription {
  return delegateFromEvent(document.body, '.cell', 'mousemove')
    .pipe(
      pluck('element'),
      distinctUntilChanged(),
      map((cell: HTMLElement) => {
        if (!(cell instanceof HTMLElement)) {
          return null;
        }
        const { x, y } = cell.dataset;
        const xElm = app.grid.element.querySelector(`.coll[data-x="${x}"]`);
        const yElm = app.grid.element.querySelector(`.number[data-y="${y}"]`);
        return { xElm, yElm };
      }),
      startWith(null),
      pairwise()
    ).subscribe(([previous, current]) => {
      if (previous) {
        const { xElm, yElm } = previous;
        [xElm, yElm].forEach(elm => {
          if (elm) elm.classList.remove('hovered');
        });
      }
      if (current) {
        const { xElm, yElm } = current;
        [xElm, yElm].forEach(elm => {
          if (elm) elm.classList.add('hovered');
        });
      }
    });
}
