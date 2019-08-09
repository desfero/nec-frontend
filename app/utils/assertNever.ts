/**
 * Exhaustiveness checking for union and enum types
 * see https://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checking
 */
export function assertNever(x: never, message = `Unexpected object: ${x}`): never {
  throw new Error(message);
}
