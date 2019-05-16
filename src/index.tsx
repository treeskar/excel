import JSX from './jsx';
import './sass/index.scss';

const ALPHABET: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const letters = (
  <section className="letters">
    {ALPHABET.map(l => <span class="letter" data-id={l}>{l}</span>)}
  </section>
);

const numbers = (
  <section className="numbers">
    {Array.from({ length: 30 }, (v: any, i: number) => <span class="number" data-id={i+1}>{i+1}</span>)}
  </section>
);

function createCell(x: string, y: number): Element {
  return <span className="cell" data-id={`${x}:${y}`} />;
}

function createGrid(rows: number, columns: number): Element {
  const cells = [];
  for (let i=0; i<columns; i++) {
    for (let y=0; y<rows; y++) {
      cells.push(createCell(ALPHABET[i], y+1));
    }
  }
  return (
    <div className="grid">
      <span className="tl-corner" />
      {letters}
      {numbers}
      <div className="cells">{...cells}</div>
    </div>
  );
}

function createHeader() {
  return (
    <header className="header">
      <input class="fx-input" type="text"/>
    </header>
  );
}

function main(): void {
  const app = (
    <main class="main">
      {createHeader()}
      {createGrid(30, ALPHABET.length)}
    </main>
  );
  document.body.appendChild(app);
}

main();
