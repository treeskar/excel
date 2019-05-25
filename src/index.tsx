import './sass/index.scss';
import { bootstrapApp } from './bootstrap';
import {
  cellFocusBehavior,
  cellHoverBehavior,
  cellDbClickBehavior,
  cellInputBehavior,
  cellKeyboardNavigationBehavior,
  headerInputBehavior,
  columnResizeBehavior,
} from './behaviors';
import { sum, minus, max, now } from './functions';
import { gridResizeBehavior } from './behaviors/grid-resize.behavior';

const app = bootstrapApp();
// initiate plugins
gridResizeBehavior(app);
cellFocusBehavior(app);
cellHoverBehavior(app);
cellDbClickBehavior(app);
cellInputBehavior(app);
cellKeyboardNavigationBehavior(app);
headerInputBehavior(app);
columnResizeBehavior(app);

// Register function
app.grid.parser.registerFunction('SUM', sum);
app.grid.parser.registerFunction('MINUS', minus);
app.grid.parser.registerFunction('MAX', max);
app.grid.parser.registerFunction('NOW', now);

// TODO: add function support: =SUM, =MINUS, =MAX, =NOW...
// TODO: select behavior
