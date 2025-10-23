import { initBackModels } from "../models/back/index";

export const initBack = async () => {
  try {
    await initBackModels();
    console.log("✅ Back database initialized");
  } catch (error) {
    console.error("❌ Error initializing Back DB:", error);
  }
};
