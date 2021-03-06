import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum KEY_CODES {
  ArrowDown = 40,
  ArrowRight = 39,
  ArrowUp = 38,
  ArrowLeft = 37,
  Escape = 27,
  Enter = 13,
  Backspace = 8,
}

export type EventDelegationType = {
  event: Event
  element: Element
};

export function delegateFromEvent(wrapper: Element, selector: string, eventName: string ): Observable<EventDelegationType> {
  return fromEvent(wrapper, eventName).pipe(
    map((event: Event) => {
      const target = event.target as Element;
      return { event, element: target.closest(selector) };
    }),
  );
}

export function isNodeEqual(node1: HTMLElement, node2: HTMLElement): boolean {
  if (node1 instanceof HTMLElement && node2 instanceof HTMLElement) {
    return node1.isEqualNode(node2);
  }
  return false;
}

export function toNumber(value: any) {}
