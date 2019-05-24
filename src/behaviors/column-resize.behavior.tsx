import JSX from '../jsx';
import { delegateFromEvent } from '../tools';
import { filter, map, mergeMap, observeOn, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ALPHABET, IBootstrapApp } from '../bootstrap';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

const DEFAULT_COLUMNS_TEMPLATE = Array.from({ length: ALPHABET.length }, () => '100px');
type colType = { element: HTMLElement, rect: DOMRect };

function updateColumnsTemplate(app: IBootstrapApp, col: colType, x: number) {
  const columns_template_value = app.grid.element.style.getPropertyValue('--coll-template');
  const columns_template = columns_template_value.length ? columns_template_value.split(' ') : DEFAULT_COLUMNS_TEMPLATE;
  const index = ALPHABET.indexOf(col.element.dataset.x);
  columns_template[index] = `${x - col.rect.x}px`;
  app.grid.element.style.setProperty('--coll-template', columns_template.join(' '));
}

function getColX(currentPosition: number, newPosition: number): number {
  return (newPosition - currentPosition > 80) ? newPosition : 80 - (newPosition - currentPosition) + newPosition;
}

export function columnResizeBehavior(app: IBootstrapApp): Subscription {
  const verticalMarker = <div className="vertical-resize-marker" />;
  app.grid.element.appendChild(verticalMarker);
  const subscription = new Subscription();

  const down$: Observable<colType> = delegateFromEvent(document.body, '.coll-resize-marker', 'mousedown').pipe(
    map(({ element }) => element && element.parentElement),
    filter(element => !!element),
    map((element) => ({ element, rect: element.getBoundingClientRect() as DOMRect })),
  );
  const up$ = fromEvent(document.body, 'mouseup');
  const move$: Observable<number> = fromEvent(document.body, 'mousemove').pipe(
    map((event: MouseEvent) => app.grid.element.scrollLeft + event.clientX),
  );

  const updateSubscription = down$.pipe(
    tap(() => app.grid.element.classList.add('no-select')),
    switchMap((col) => up$.pipe(
      map((event: MouseEvent) => ({ col, x: event.clientX })),
      map(({ col, x }) => ({ col, x: getColX(col.rect.x, x) })),
      take(1),
    )),
  ).subscribe(({ col, x }) => {
    verticalMarker.style.transform = 'translateX(-2px)';
    app.grid.element.classList.remove('no-select');
    updateColumnsTemplate(app, col, x);
  });

  const moveSubscription = down$.pipe(
    mergeMap(col => move$.pipe(
      map((x) => {
        const scrollLeft = app.grid.element.scrollLeft;
        return getColX(col.rect.x, x - scrollLeft) + scrollLeft;
      }),
      observeOn(animationFrame),
      takeUntil(up$),
    )),
  ).subscribe((x) => {
    verticalMarker.style.transform = `translateX(${x}px)`
  });

  subscription.add(updateSubscription);
  subscription.add(moveSubscription);
  return subscription;
}
