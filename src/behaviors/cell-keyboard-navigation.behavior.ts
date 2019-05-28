import { delegateFromEvent, EventDelegationType } from '../tools';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';
import { IBootstrapApp, ALPHABET } from '../bootstrap';
import { Cell } from '../cell';

enum KEY_CODES {
  ArrowDown = 40,
  ArrowRight = 39,
  ArrowUp = 38,
  ArrowLeft = 37,
  Escape = 27,
  Enter = 13,
  Backspace = 8,
}

const knownCodes = new Set([
  KEY_CODES.ArrowUp,
  KEY_CODES.ArrowDown,
  KEY_CODES.ArrowRight,
  KEY_CODES.ArrowLeft,
  KEY_CODES.Escape,
  KEY_CODES.Enter,
  KEY_CODES.Backspace,
]);

export function cellKeyboardNavigationBehavior(app: IBootstrapApp): Subscription {
  return delegateFromEvent(app.grid.element, '.cell', 'keydown')
    .pipe(
      map((obj: EventDelegationType ) => obj.event),
      withLatestFrom(app.grid.focused$),
      filter(([event, cell]: [KeyboardEvent, Cell]) => (knownCodes.has(event.which) && cell instanceof Cell)),
    )
    .subscribe(([event, cell]) => {
      event.stopPropagation();
      let focusedCell: Cell;
      let xIndex: number;
      let yIndex: number;
      switch (event.keyCode) {
        case KEY_CODES.ArrowLeft:
          xIndex = ALPHABET.indexOf(cell.x);
          if (cell.isEditable || !xIndex) {
            break;
          }
          focusedCell = app.grid.getCell(ALPHABET[xIndex - 1], cell.y);
          app.grid.focused$.next(focusedCell);
          break;
        case KEY_CODES.ArrowRight:
          xIndex = ALPHABET.indexOf(cell.x);
          if (cell.isEditable || xIndex === ALPHABET.length - 1) {
            break;
          }
          focusedCell = app.grid.getCell(ALPHABET[xIndex + 1], cell.y);
          app.grid.focused$.next(focusedCell);
          break;
        case KEY_CODES.ArrowUp:
          yIndex = parseInt(cell.y);
          if (cell.isEditable || yIndex === 1) {
            break;
          }
          focusedCell = app.grid.getCell(cell.x, (yIndex - 1).toString());
          app.grid.focused$.next(focusedCell);
          break;
        case KEY_CODES.ArrowDown:
          if (cell.isEditable) {
            break;
          }
          yIndex = parseInt(cell.y);
          focusedCell = app.grid.getCell(cell.x, (yIndex + 1).toString());
          app.grid.focused$.next(focusedCell);
          break;
        case KEY_CODES.Enter:
          event.preventDefault();
          if (event.metaKey) {
            app.header.input.focus();
          } else {
            cell.editable = !cell.isEditable;
            if (!cell.isEditable) {
              app.grid.element.focus();
            }
          }
          break;
        case KEY_CODES.Backspace:
          // if (!cell.isEditable) {
          //   cell.input$.next('');
          // }
          break;
      }
    });
}
