import { delegateFromEvent } from '../tools';
import { pluck } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IBootstrapApp } from '../bootstrap';

export function cellFocusBehavior(app: IBootstrapApp): Subscription {
  return delegateFromEvent(app.grid.element, '.cell', 'click')
    .pipe(pluck('element'))
    .subscribe((newCell) => {
      app.grid.focused$.next(app.grid.getCellByElement(newCell as HTMLElement));
    });
}
