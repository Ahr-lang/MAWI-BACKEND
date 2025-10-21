import { Router } from 'express';
import {
  createSubmission,
  getUserForms,
  getFormById,
  getAllUserForms
} from '../controllers/form.controller';
import { protectAuth } from "../middlewares/protect";
import { uploadSingleImage, uploadToMinio } from "../middlewares/common/minioUpload";

const router = Router();

// Create new form submission
router.post("/:tenant/forms/:formKey/submission", ...protectAuth, uploadSingleImage, uploadToMinio,createSubmission);

// Get all forms of a specific type for the authenticated user
router.get("/:tenant/forms/:formKey", ...protectAuth, getUserForms);

// Get all forms across all types for the authenticated user
router.get("/:tenant/forms", ...protectAuth, getAllUserForms);

// Get specific form by ID
router.get("/:tenant/forms/:formKey/:formId", ...protectAuth, getFormById);

export default router;