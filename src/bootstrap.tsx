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

function createGrid(): HTMLElement {
  return (
    <div className="grid" tabindex="0">
      <span className="tl-corner" />
      {xAxis}
      <section className="numbers" />
      <div className="cells" />
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
  header: {
    element: HTMLElement,
    input: HTMLInputElement,
  };
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
  return {
    header: { element: header, input: header.querySelector('.fx-input') },
    grid: new Grid(grid),
  };
}

