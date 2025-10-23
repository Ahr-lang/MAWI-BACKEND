import { initBiomoModels } from "../models/biomo";

export const initBiomo = async () => {
  try {
    await initBiomoModels();
    console.log("✅ Biomo database initialized");
  } catch (error) {
    console.error("❌ Error initializing Biomo DB:", error);
  }
};
