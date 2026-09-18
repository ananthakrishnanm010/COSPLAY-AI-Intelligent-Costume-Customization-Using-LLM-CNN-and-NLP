import catchAsync from '../utils/catchAsync.js';

export const uploadReferenceImageHandler = catchAsync(async (req, res) => {
  if (!req.file) {
    const error = new Error('Please upload a reference image.');
    error.statusCode = 400;
    throw error;
  }

  res.status(201).json({
    status: 'success',
    message: 'Reference image uploaded successfully.',
    data: {
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
      },
    },
  });
});