export function minus(result: any, ...args: any[]) {
  result = parseInt(result, 10);
  if (Number.isNaN(result)) {
    return { error: true, message: 'argument 1 is not a number' };
  }
  for (let i = 0; i<args.length; i++) {
    const num = parseInt(args[i], 10);
    if (Number.isNaN(num)) {
      return { error: true, message: `argument ${i} is not a number` };
    }
    result -= num;
  }
  return { error: false, result };
}
