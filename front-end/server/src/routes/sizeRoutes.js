import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/sizes/:sizeId/measurements
router.get('/:sizeId/measurements', async (req, res) => {
  try {
    const { sizeId } = req.params;

    const size = await prisma.brandSize.findUnique({
      where: {
        id: sizeId,
      },
      include: {
        measurements: {
          include: {
            measurementType: true,
          },
        },
      },
    });

    if (!size) {
      return res.status(404).json({
        status: 'error',
        message: 'Size not found',
      });
    }

    res.json({
      status: 'success',
      data: {
        sizeId: size.id,
        garmentType: size.garmentType,
        sizeLabel: size.sizeLabel,
        measurements: size.measurements,
      },
    });
  } catch (error) {
    console.error('Error fetching size measurements:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch size measurements',
    });
  }
});

export default router;