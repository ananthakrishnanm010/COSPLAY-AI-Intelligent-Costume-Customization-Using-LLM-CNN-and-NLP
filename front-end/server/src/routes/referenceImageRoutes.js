import { Router } from 'express';
import { uploadReferenceImageHandler } from '../controllers/referenceImageController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/', upload.single('image'), uploadReferenceImageHandler);

export default router;