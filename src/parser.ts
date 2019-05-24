import { Cell } from './cell';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Grid, CELL_ID_PATTERN } from './grid';

const FUNCTION_PATTERN = /^=([A-Z]+)\((.*)\)$/i;

export class Parser {

  private FUNCTIONS = new Map();

  constructor(protected grid: Grid) {}

  public registerFunction<T, R>(name: string, operator: (...args: T[]) => R) {
    name = name.trim().toUpperCase();
    if (this.FUNCTIONS.has(name)) {
      throw new Error(`function with name ${name} already exists`);
    }
    this.FUNCTIONS.set(name, operator);
  }

  public unregisterFunction(name: string) {
    this.FUNCTIONS.delete(name);
  }

  public isFunction(input: string): boolean {
    return !!this.getFunction(input);
  }

  getFunction<T, R>(input: string): { operator: (...args: T[]) => R, args: string[], name: string } | null {
    const match = input.match(FUNCTION_PATTERN);
    if (!match) {
      return null;
    }
    const name = match[1];
    const args = match[2].split(',');
    if (this.FUNCTIONS.has(name)) {
      return { operator: this.FUNCTIONS.get(name), args, name };
    }
    return null;
  }

  public exec(input: string): { dependencies: Cell[], output$: Observable<any> } {
    const response : { dependencies: Cell[], output$: Observable<any> } = { dependencies: [], output$: of() };
    const functionObject = this.getFunction(input);
    if (!functionObject) {
      response.output$ = of({ error: true, message: 'function not found'});
      return response;
    }
    const args = functionObject.args.map(arg => this.resolveArgument(arg));
    const input$ = args.reduce((acc, arg) => {
      let output$ = of({ result: arg });
      if (arg instanceof Cell) {
        response.dependencies.push(arg);
        output$ = arg.output$;
      }
      return [...acc, output$];
    }, []);
    response.output$ = combineLatest(...input$).pipe(
      map(args => args.map(arg => arg.result )),
      map(args => functionObject.operator(...args)),
    );
    return response;
  }

  private resolveArgument(argument: string) {
    const token = argument.trim();
    // is cellId
    const cellMatch = token.match(CELL_ID_PATTERN);
    if (cellMatch) {
      return this.grid.getCell(cellMatch[1], cellMatch[2]);
    }
    return argument;
  }

}
