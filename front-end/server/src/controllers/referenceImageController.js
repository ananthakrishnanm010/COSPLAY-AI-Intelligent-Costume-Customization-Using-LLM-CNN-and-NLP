import catchAsync from '../utils/catchAsync.js';

export const uploadReferenceImageHandler = catchAsync(async (req, res) => {
  if (!req.file) {
    const error = new Error('Please upload a reference image.');
    error.statusCode = 400;
    throw error;
  }

  const referenceImageUrl =
    `/uploads/reference-images/${req.file.filename}`;

  res.status(201).json({
    success: true,
    referenceImageUrl,
  });
});