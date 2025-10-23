import { initRoboModels } from "../models/robo";

export const initRobo = async () => {
  try {
    await initRoboModels();
    console.log("✅ Robo database initialized");
  } catch (error) {
    console.error("❌ Error initializing Robo DB:", error);
  }
};
