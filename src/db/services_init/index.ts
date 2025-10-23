import { initBack } from "./init.back";
import { initAgromo } from "./init.agromo";
import { initBiomo } from "./init.biomo";
import { initRobo } from "./init.robo";

export const initAllDatabases = async () => {
  console.log("🚀 Initializing all databases...");
  await Promise.all([
    initBack(),
    initAgromo(),
    initBiomo(),
    initRobo(),
  ]);
  console.log("✅ All databases initialized successfully");
};
