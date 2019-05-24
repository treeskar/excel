export function max(...args: any[]) {
  const result = Math.max(...args.map(value => parseInt(value, 10)));
  return { error: false, result };
}
