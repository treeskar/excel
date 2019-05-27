import { BehaviorSubject, of, Subscription } from 'rxjs';
import { filter, map, pairwise, switchMap } from 'rxjs/operators';
import { Grid, CELL_ID_PATTERN } from './grid';
import { CellElement } from './cellElement';

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
  element: CellElement;

  constructor(protected grid: Grid, public x: string, public y: string) {
    this.id = `${x}${y}`;
    this.element = this.grid.render.getCellElement(this.x, this.y);

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

  set editable(state: boolean) {
    this.isEditable = state;
    if (state) {
      this.element.setEditable(true).setText(this.input$.value).focus();
    } else if (!state) {
      this.element.setEditable(false).setText(this.output$.value.result).focus();
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
    if (currentValue.error) {
      this.element.setError(currentValue.result);
      return;
    }
    if (previousValue.error) {
      this.element.removeClass('error');
    }
    this.element.setText(currentValue.result);
  }

  errorRender(error: Error) {
    console.log(error);
  }

  destroy() {
    this.subscription.unsubscribe();
  }

}
