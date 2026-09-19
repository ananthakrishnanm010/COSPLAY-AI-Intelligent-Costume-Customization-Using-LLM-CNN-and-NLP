import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Measurement types (key must be unique across all garments) ───────────────

const MEASUREMENT_TYPES = [
  { key: 'chest',         label: 'Chest',          unit: 'inch' },
  { key: 'waist',         label: 'Waist',          unit: 'inch' },
  { key: 'hip',           label: 'Hip',            unit: 'inch' },
  { key: 'shoulder',      label: 'Shoulder',       unit: 'inch' },
  { key: 'sleeve',        label: 'Sleeve Length',  unit: 'inch' },
  { key: 'length',        label: 'Body Length',    unit: 'inch' },
  { key: 'inseam',        label: 'Inseam',         unit: 'inch' },
  { key: 'thigh',         label: 'Thigh',          unit: 'inch' },
];

// ─── Brands ───────────────────────────────────────────────────────────────────

const BRANDS = [
  { name: "Levi's",   slug: 'levis'    },
  { name: 'Nike',     slug: 'nike'     },
  { name: 'Adidas',   slug: 'adidas'   },
  { name: 'Puma',     slug: 'puma'     },
  { name: 'H&M',      slug: 'hm'       },
  { name: 'Zara',     slug: 'zara'     },
  { name: 'Uniqlo',   slug: 'uniqlo'   },
  { name: 'Roadster', slug: 'roadster' },
  { name: 'Wrangler', slug: 'wrangler' },
];

// ─── Size / measurement data per garment ──────────────────────────────────────
// Each entry: { sizeLabel, measurements: { [measurementTypeKey]: value } }
// Only include keys relevant to that garment.

const TSHIRT_SIZES = [
  { sizeLabel: 'XS', measurements: { chest: 34, shoulder: 16.5, sleeve: 7.5,  length: 26 } },
  { sizeLabel: 'S',  measurements: { chest: 36, shoulder: 17,   sleeve: 8,    length: 27 } },
  { sizeLabel: 'M',  measurements: { chest: 38, shoulder: 17.5, sleeve: 8.5,  length: 28 } },
  { sizeLabel: 'L',  measurements: { chest: 40, shoulder: 18,   sleeve: 9,    length: 29 } },
  { sizeLabel: 'XL', measurements: { chest: 42, shoulder: 18.5, sleeve: 9.5,  length: 30 } },
  { sizeLabel: 'XXL',measurements: { chest: 44, shoulder: 19,   sleeve: 10,   length: 31 } },
];

const SHIRT_SIZES = [
  { sizeLabel: 'XS', measurements: { chest: 35, shoulder: 16.5, sleeve: 23.5, length: 27, waist: 30 } },
  { sizeLabel: 'S',  measurements: { chest: 37, shoulder: 17,   sleeve: 24,   length: 28, waist: 32 } },
  { sizeLabel: 'M',  measurements: { chest: 39, shoulder: 17.5, sleeve: 24.5, length: 29, waist: 34 } },
  { sizeLabel: 'L',  measurements: { chest: 41, shoulder: 18,   sleeve: 25,   length: 30, waist: 36 } },
  { sizeLabel: 'XL', measurements: { chest: 43, shoulder: 18.5, sleeve: 25.5, length: 31, waist: 38 } },
  { sizeLabel: 'XXL',measurements: { chest: 45, shoulder: 19,   sleeve: 26,   length: 32, waist: 40 } },
];

const HOODIE_SIZES = [
  { sizeLabel: 'XS', measurements: { chest: 36, shoulder: 17,   sleeve: 24,   length: 26, waist: 32 } },
  { sizeLabel: 'S',  measurements: { chest: 38, shoulder: 17.5, sleeve: 24.5, length: 27, waist: 34 } },
  { sizeLabel: 'M',  measurements: { chest: 40, shoulder: 18,   sleeve: 25,   length: 28, waist: 36 } },
  { sizeLabel: 'L',  measurements: { chest: 42, shoulder: 18.5, sleeve: 25.5, length: 29, waist: 38 } },
  { sizeLabel: 'XL', measurements: { chest: 44, shoulder: 19,   sleeve: 26,   length: 30, waist: 40 } },
  { sizeLabel: 'XXL',measurements: { chest: 46, shoulder: 19.5, sleeve: 26.5, length: 31, waist: 42 } },
];

const JEANS_SIZES = [
  { sizeLabel: '28', measurements: { waist: 28, hip: 36, inseam: 30, thigh: 21 } },
  { sizeLabel: '30', measurements: { waist: 30, hip: 38, inseam: 30, thigh: 22 } },
  { sizeLabel: '32', measurements: { waist: 32, hip: 40, inseam: 31, thigh: 23 } },
  { sizeLabel: '34', measurements: { waist: 34, hip: 42, inseam: 31, thigh: 24 } },
  { sizeLabel: '36', measurements: { waist: 36, hip: 44, inseam: 32, thigh: 25 } },
  { sizeLabel: '38', measurements: { waist: 38, hip: 46, inseam: 32, thigh: 26 } },
];

// Map garmentType enum → size data
const GARMENT_SIZES = {
  TSHIRT: TSHIRT_SIZES,
  SHIRT:  SHIRT_SIZES,
  HOODIE: HOODIE_SIZES,
  JEANS:  JEANS_SIZES,
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('[BrandSeed] Starting brand + measurement seed...');

  // 1. Upsert measurement types
  console.log('[BrandSeed] Upserting measurement types...');
  const mtMap = {}; // key → id

  for (const mt of MEASUREMENT_TYPES) {
    const record = await prisma.measurementType.upsert({
      where:  { key: mt.key },
      update: { label: mt.label, unit: mt.unit },
      create: { key: mt.key, label: mt.label, unit: mt.unit },
    });
    mtMap[mt.key] = record.id;
    console.log(`  ✓ MeasurementType: ${mt.key} (${record.id})`);
  }

  // 2. Upsert brands + their sizes + measurements
  for (const brandData of BRANDS) {
    console.log(`\n[BrandSeed] Processing brand: ${brandData.name}`);

    const brand = await prisma.brand.upsert({
      where:  { slug: brandData.slug },
      update: { name: brandData.name },
      create: { name: brandData.name, slug: brandData.slug },
    });

    console.log(`  ✓ Brand: ${brand.name} (${brand.id})`);

    for (const [garmentType, sizes] of Object.entries(GARMENT_SIZES)) {
      for (const sizeData of sizes) {
        // Upsert BrandSize
        const brandSize = await prisma.brandSize.upsert({
          where: {
            brandId_garmentType_sizeLabel: {
              brandId:     brand.id,
              garmentType: garmentType,
              sizeLabel:   sizeData.sizeLabel,
            },
          },
          update: {},
          create: {
            brandId:     brand.id,
            garmentType: garmentType,
            sizeLabel:   sizeData.sizeLabel,
          },
        });

        // Upsert BrandSizeMeasurement for each measurement
        for (const [key, value] of Object.entries(sizeData.measurements)) {
          const mtId = mtMap[key];
          if (!mtId) continue;

          await prisma.brandSizeMeasurement.upsert({
            where: {
              brandSizeId_measurementTypeId: {
                brandSizeId:       brandSize.id,
                measurementTypeId: mtId,
              },
            },
            update: { value },
            create: {
              brandSizeId:       brandSize.id,
              measurementTypeId: mtId,
              value,
            },
          });
        }

        console.log(`    ✓ ${garmentType} ${sizeData.sizeLabel}`);
      }
    }
  }

  console.log('\n[BrandSeed] Brand + measurement seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('[BrandSeed] Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
