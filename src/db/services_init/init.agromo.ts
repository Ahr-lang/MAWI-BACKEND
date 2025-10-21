import { initAgromoModels } from "../models/agromo";

export const initAgromo = async () => {
  try {
    await initAgromoModels();
    console.log("✅ Agromo database initialized");
  } catch (error) {
    console.error("❌ Error initializing Agromo DB:", error);
  }
};
