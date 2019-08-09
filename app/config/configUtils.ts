export function getRequiredEnv(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} missing!`);
  }

  return value;
}

export function getRequiredNumber(env: NodeJS.ProcessEnv, name: string): number {
  const str = getRequiredEnv(env, name);
  const parsedNumber = parseFloat(str);
  if (isNaN(parsedNumber)) {
    throw new Error(`Parsing ${name} failed. Value was: ${str}`);
  }

  return parsedNumber;
}

export function getOptionalEnv(env: NodeJS.ProcessEnv, name: string): string | undefined {
  return env[name];
}

/**
 * Validates if feature flag is "0", "1" or undefined.
 */
export function verifyOptionalFlagEnv(env: NodeJS.ProcessEnv, name: string): void {
  const value = env[name];

  if (!value) {
    return;
  }

  if (value !== "0" && value !== "1") {
    throw new Error(`Env flag ${name} has incorrect value. Correct values: "0", "1"`);
  }
}
