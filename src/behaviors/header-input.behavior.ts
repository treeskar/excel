import { filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { IBootstrapApp } from '../bootstrap';
import { fromEvent, Subscription } from 'rxjs';
import { Cell } from '../cell';
import { KEY_CODES } from '../tools';

export function headerInputBehavior(app: IBootstrapApp): Subscription {
  // TODO: support ENTER key (move to and focus cell)
  const subscription = new Subscription();
  const primaryInput: HTMLInputElement = app.header.input;

  // update primary input when cell focus changed
  const focusedSubscription = app.grid.focused$.pipe(
    filter(cell => cell instanceof Cell),
    switchMap(cell => cell.input$),
    filter(input => primaryInput.value !== input),
  ).subscribe((input: string) => {
    primaryInput.value = input;
  });
  subscription.add(focusedSubscription);

  // update cell input when primary input changed
  const inputSubscription = fromEvent(primaryInput, 'input').pipe(
    withLatestFrom(app.grid.focused$),
    filter(([{ target }, cell]: [InputEvent, Cell]) => cell instanceof Cell && cell.input$.value !== (target as HTMLInputElement).value),
  ).subscribe(([ { target }, cell ]) => {
    (cell as Cell).input$.next((target as HTMLInputElement).value);
  });
  subscription.add(inputSubscription);

  // move focus to grid element on ENTER
  const enterSubscription = fromEvent(primaryInput, 'keydown').pipe(
    filter((event: KeyboardEvent) => event.which === KEY_CODES.Enter),
  ).subscribe((event: KeyboardEvent) => {
    event.stopPropagation();
    app.grid.element.focus();
  });
  subscription.add(enterSubscription);

  return subscription;
}
