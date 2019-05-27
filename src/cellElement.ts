export class CellElement {

  constructor(private x: string, private y: string | number, private container: HTMLElement) {}

  get nativeElement(): HTMLElement {
    return this.container.querySelector(`.cell[data-x="${this.x}"][data-y="${this.y}"]`);
  }

  exec(operation: (element: HTMLElement) => void) {
    const element = this.nativeElement;
    if (element instanceof HTMLElement) {
      operation(element);
    }
  }

  focus(): CellElement {
    this.exec(element => element.focus());
    return this;
  }

  setText(text: string): CellElement {
    this.exec(element => element.innerText = text);
    return this;
  }

  setError(error: string): CellElement {
    this.exec((element) => {
      element.classList.add('error');
      element.innerText = error;
    });
    return this;
  }

  setEditable(isEditable: boolean): CellElement {
    this.exec((element) => {
      if (isEditable && !element.isContentEditable) {
        element.contentEditable = 'true';
      } else if (!isEditable && element.isContentEditable) {
        element.contentEditable = 'false';
      }
    });
    return this;
  }

  addClass(className: string): CellElement {
    this.exec(element => element.classList.add(className));
    return this;
  }

  removeClass(className: string): CellElement {
    this.exec(element => element.classList.remove(className));
    return this;
  }

}
