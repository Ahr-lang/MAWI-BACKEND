// src/api/routes/form.routes.ts
import { Router } from 'express';
import {
  createSubmission,
  getUserForms,
  getFormById,
  updateForm,
  deleteForm,
  getAllUserForms
} from '../controllers/form.controller';
import { protectAuth } from "../middlewares/protect";

const router = Router();

// Create new form submission
router.post("/:tenant/forms/:formKey/submission", ...protectAuth, createSubmission);

// Get all forms of a specific type for the authenticated user
router.get("/:tenant/forms/:formKey", ...protectAuth, getUserForms);

// Get all forms across all types for the authenticated user
router.get("/:tenant/forms", ...protectAuth, getAllUserForms);

// Get specific form by ID
router.get("/:tenant/forms/:formKey/:formId", ...protectAuth, getFormById);

// Update specific form
router.put("/:tenant/forms/:formKey/:formId", ...protectAuth, updateForm);

// Delete specific form
router.delete("/:tenant/forms/:formKey/:formId", ...protectAuth, deleteForm);

export default router;