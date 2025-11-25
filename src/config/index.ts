import { readFileSync } from "fs";
import { resolve } from "path";

interface Config {
  /**
   * Retrieves an environment variable value.
   * @param key - The environment variable name
   * @returns The value if it exists, otherwise undefined
   */
  get(key: string): string | undefined;

  /**
   * Retrieves a required environment variable value.
   * @param key - The environment variable name
   * @returns The value if it exists
   * @throws Error if the environment variable is not defined
   */
  require(key: string): string;

  readonly isDevelopmentMode: boolean;
  readonly isProductionMode: boolean;
}

const createConfig = (): Config => {
  const configStore: Record<string, string> = {};

  // Load environment variables from .env file
  try {
    const data = readFileSync(resolve(__dirname, "..", "..", ".env"), "utf8");
    const lines = data.split("\n");
    lines.forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) configStore[key.trim()] = value.trim();
    });
  } catch (error) {
    console.error("An error occurred while loading environment variables", error);
  }

  // Merge with process.env variables (like those set by cross-env) take precedence
  Object.keys(process.env).forEach((key) => {
    const value = process.env[key];
    if (value) configStore[key] = value;
  });

  return {
    isDevelopmentMode: configStore["ENVIRONMENT"] === "development",
    isProductionMode: configStore["ENVIRONMENT"] === "production",

    get: (key: string): string | undefined => configStore[key],

    require: (key: string): string => {
      const value = configStore[key];
      if (!value) throw new Error(`${key} is not defined in environment variables.`);
      return value;
    },
  };
};

const config = createConfig();

export default config;
