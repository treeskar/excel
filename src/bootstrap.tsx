import JSX from './jsx';
import { Grid } from './grid';

export const ALPHABET: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const xAxis: HTMLElement = (
  <section className="columns">
    {ALPHABET.map(l => (
      <span className="coll" data-x={l}>
        <span className="coll-content">{l}</span>
        <span className="coll-resize-marker" />
      </span>
    ))}
  </section>
);

function getYAxis(rows: number): HTMLElement {
  return <section className="numbers">
    {Array.from({length: rows}, (v: any, i: number) => <span class="number" data-y={i + 1}>{i + 1}</span>)}
  </section>
}

function createCell(x: string, y: number): HTMLElement {
  return <span className="cell" data-x={x} data-y={y} />;
}

function generateCells(rows: number): HTMLElement {
  const cells = [];
  for (let y=0; y<rows; y++) {
    for (let i=0; i<ALPHABET.length; i++) {
      cells.push(createCell(ALPHABET[i], y+1));
    }
  }
  return <div className="cells">{...cells}</div>
}

function getViewportRows(container: HTMLElement): number {
  return  Math.floor(container.offsetHeight / 36);
}

function createGrid(): HTMLElement {
  return (
    <div className="grid">
      <span className="tl-corner" />
      {xAxis}
    </div>
  );
}

function createHeader(): HTMLElement {
  return (
    <header className="header">
      <input className="fx-input" type="text"/>
      <img className="fx-icon" alt="function" src="assets/function-icon.svg" />
    </header>
  );
}

export interface IBootstrapApp {
  header: HTMLElement;
  grid: Grid;
}

export function bootstrapApp(): IBootstrapApp {
  const header = createHeader();
  // TODO: calculate number of rows that fits to screen viewport
  const grid = createGrid();
  const app = (
    <main class="main">
      {header}
      {grid}
    </main>
  );
  document.body.appendChild(app);
  const rows = getViewportRows(grid);
  grid.style.setProperty('--rows', rows.toString());
  grid.appendChild(getYAxis(rows));
  grid.appendChild(generateCells(rows));
  return { header, grid: new Grid(grid) };
}

