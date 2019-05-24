export function sum(...args: any[]) {
  let result = 0;
  for (let i = 0; i<args.length; i++) {
    const num = parseInt(args[i], 10);
    if (Number.isNaN(num)) {
      return { error: true, message: `argument ${i} is not a number` };
    }
    result += num;
  }
  return { error: false, result };
}
