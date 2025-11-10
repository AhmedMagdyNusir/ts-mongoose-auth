import { ENVIRONMENT } from "@/utils/constants";

export const isDevelopmentMode = ENVIRONMENT === "development";
export const isProductionMode = ENVIRONMENT === "production";
