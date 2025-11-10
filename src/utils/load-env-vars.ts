import { readFileSync } from "fs";
import { resolve } from "path";

export default function loadEnvironmentVariables(): void {
  try {
    const data = readFileSync(resolve(__dirname, "..", "..", ".env"), "utf8");
    const lines = data.split("\n");
    lines.forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value && !process.env[key.trim()]) {
        process.env[key.trim()] = value.trim();
      }
    });
  } catch (error) {
    console.error("An error occurred while loading environment variables", error);
  }
}
