export function now() {
  return {
    error: false,
    result: new Date().toLocaleString(),
  };
}
