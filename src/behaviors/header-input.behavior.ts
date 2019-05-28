import { filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { IBootstrapApp } from '../bootstrap';
import { fromEvent, Subscription } from 'rxjs';
import { Cell } from '../cell';

export function headerInputBehavior(app: IBootstrapApp): Subscription {
  const subscription = new Subscription();
  const inputElement: HTMLInputElement = app.header.input;
  const focusedSubscription = app.grid.focused$.pipe(
    filter(cell => cell instanceof Cell),
    switchMap(cell => cell.input$),
    filter(input => inputElement.value !== input),
  ).subscribe((input: string) => {
    inputElement.value = input;
  });
  subscription.add(focusedSubscription);

  const inputSubscription = fromEvent(inputElement, 'input').pipe(
    withLatestFrom(app.grid.focused$),
    filter(([{ target }, cell]: [InputEvent, Cell]) => cell instanceof Cell && cell.input$.value !== (target as HTMLInputElement).value),
  ).subscribe(([ { target }, cell ]) => {
    (cell as Cell).input$.next((target as HTMLInputElement).value);
  });

  subscription.add(inputSubscription);
  return subscription;
}
