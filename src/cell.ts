import { BehaviorSubject, of, Subscription } from 'rxjs';
import { filter, map, pairwise, switchMap } from 'rxjs/operators';
import { Grid, CELL_ID_PATTERN } from './grid';

function getCellElement(x: string, y: string): HTMLElement | null {
  return document.body.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

interface IOutput {
  error?: boolean,
  errorId?: InputErrorTypes,
  result: string
}

export enum InputErrorTypes {
  CIRCULAR_DEPENDENCIES
}

export class Cell {

  id: string;
  input$: BehaviorSubject<string> = new BehaviorSubject('');
  output$: BehaviorSubject<IOutput> = new BehaviorSubject({ result: ''});
  subscription: Subscription = new Subscription();
  dependencies: Cell[] = [];
  isEditable: boolean = false;

  constructor(protected grid: Grid, public x: string, public y: string) {
    this.id = `${x}${y}`;

    const inputSubscription = this.input$.pipe(
      map(value => this.parseInput(value)),
      switchMap(output$ => output$),
    ).subscribe(
      output => this.output$.next(output),
      error => this.errorRender(error),
    );
    this.subscription.add(inputSubscription);

    const outputSubscription = this.output$.pipe(
      pairwise(),
      filter(() => !this.isEditable),
    ).subscribe(
      ([previous, current]) => this.outputRender(previous, current),
      error => this.errorRender(error),
    );
    this.subscription.add(outputSubscription);
  }

  get element(): HTMLElement | null {
    return getCellElement(this.x, this.y);
  }

  set editable(state: boolean) {
    this.isEditable = state;
    const element = this.element;
    if (!(element instanceof  HTMLElement)) {
      return;
    }
    if (state && !element.isContentEditable) {
      element.contentEditable = 'true';
      element.innerText = this.input$.value;
      element.focus();
    } else if (!state && element.isContentEditable) {
      element.contentEditable = 'false';
      element.innerText = this.output$.value.result;
    }
  }

  parseInput(input: string) {
    const token = input.trim().toUpperCase().replace(/ +/g, ' ');
    // is cell
    if (CELL_ID_PATTERN.test(token)) {
      const x = token[0];
      const y = token.substr(1);
      const cell = this.grid.getCell(x, y);
      // prevent circular dependencies
      if (this.isDependsOnMe(cell)) {
        return of({ error: true, errorId: InputErrorTypes.CIRCULAR_DEPENDENCIES, result: '#ERROR' });
      }
      this.dependencies = [cell];
      return cell.output$;
    }
    if (this.grid.parser.isFunction(token)) {
      const { dependencies, output$ } = this.grid.parser.exec(token);
      if (dependencies.some(cell => this.isDependsOnMe(cell))) {
        return of({ error: true, errorId: InputErrorTypes.CIRCULAR_DEPENDENCIES, result: '#ERROR' });
      }
      this.dependencies = dependencies;
      return output$;
    }
    return of({ result: input });
  }

  isDependsOnMe(cell: Cell): boolean {
    if (!(cell instanceof Cell)) {
      return false;
    }
    if (cell === this) {
      return true;
    }
    return cell.dependencies.some(cell => this.isDependsOnMe(cell));
  }

  outputRender(previousValue: IOutput, currentValue: IOutput) {
    const element = this.element;
    if (!element) {
      return;
    }
    if (currentValue.error) {
      element.classList.add('error');
      element.innerText = currentValue.result;
      return;
    }
    if (previousValue.error) {
      element.classList.remove('error');
    }
    element.innerText = currentValue.result;
  }

  errorRender(error: Error) {
    console.log(error);
  }

  destroy() {
    this.subscription.unsubscribe();
  }

}
