import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/brands
router.get('/', async (_req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      status: 'success',
      data: brands,
    });
  } catch (error) {
    console.error('Error fetching brands:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch brands',
    });
  }
});


// GET /api/v1/brands/:brandId/sizes
router.get('/:brandId/sizes', async (req, res) => {
  try {
    const { brandId } = req.params;

    const sizes = await prisma.brandSize.findMany({
      where: {
        brandId: brandId,
      },
      orderBy: [
        {
          garmentType: 'asc',
        },
        {
          sizeLabel: 'asc',
        },
      ],
    });

    res.json({
      status: 'success',
      data: sizes,
    });
  } catch (error) {
    console.error('Error fetching brand sizes:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch brand sizes',
    });
  }
});


// GET /api/v1/brands/:brandId/:garmentType/sizes
router.get('/:brandId/:garmentType/sizes', async (req, res) => {
  try {
    const { brandId, garmentType } = req.params;

    const sizes = await prisma.brandSize.findMany({
      where: {
        brandId: brandId,
        garmentType: garmentType.toUpperCase(),
      },
      orderBy: {
        sizeLabel: 'asc',
      },
    });

    res.json({
      status: 'success',
      data: sizes,
    });
  } catch (error) {
    console.error('Error fetching garment sizes:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch garment sizes',
    });
  }
});

export default router;