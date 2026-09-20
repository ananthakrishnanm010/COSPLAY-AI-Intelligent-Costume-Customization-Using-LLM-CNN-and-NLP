import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const brands = [
  { name: "Nike", slug: "nike" },
  { name: "Adidas", slug: "adidas" },
  { name: "Levi's", slug: "levis" },
  { name: "H&M", slug: "hm" },
  { name: "Uniqlo", slug: "uniqlo" },
];

const measurementTypes = [
  { key: "chest", label: "Chest", unit: "inch" },
  { key: "shoulder", label: "Shoulder", unit: "inch" },
  { key: "sleeve_length", label: "Sleeve Length", unit: "inch" },
  { key: "length", label: "Length", unit: "inch" },
  { key: "waist", label: "Waist", unit: "inch" },
  { key: "hip", label: "Hip", unit: "inch" },
  { key: "inseam", label: "Inseam", unit: "inch" },
];

const sizeLabels = ["S", "M", "L", "XL"];

const measurementTemplates = {
  SHIRT: {
    S: { chest: 38, shoulder: 17, sleeve_length: 24, length: 28 },
    M: { chest: 40, shoulder: 18, sleeve_length: 24.5, length: 29 },
    L: { chest: 42, shoulder: 19, sleeve_length: 25, length: 30 },
    XL: { chest: 44, shoulder: 20, sleeve_length: 25.5, length: 31 },
  },

  TSHIRT: {
    S: { chest: 38, shoulder: 16.5, sleeve_length: 8, length: 27 },
    M: { chest: 40, shoulder: 17.5, sleeve_length: 8.5, length: 28 },
    L: { chest: 42, shoulder: 18.5, sleeve_length: 9, length: 29 },
    XL: { chest: 44, shoulder: 19.5, sleeve_length: 9.5, length: 30 },
  },

  HOODIE: {
    S: { chest: 40, shoulder: 18, sleeve_length: 24, length: 27 },
    M: { chest: 42, shoulder: 19, sleeve_length: 25, length: 28 },
    L: { chest: 44, shoulder: 20, sleeve_length: 26, length: 29 },
    XL: { chest: 46, shoulder: 21, sleeve_length: 27, length: 30 },
  },

  JEANS: {
    S: { waist: 30, hip: 38, inseam: 30 },
    M: { waist: 32, hip: 40, inseam: 31 },
    L: { waist: 34, hip: 42, inseam: 32 },
    XL: { waist: 36, hip: 44, inseam: 32 },
  },
};

async function main() {
  console.log("[AI Seed] Starting...");

  const measurementTypeMap = {};

  for (const item of measurementTypes) {
    const record = await prisma.measurementType.upsert({
      where: {
        key: item.key,
      },
      update: {
        label: item.label,
        unit: item.unit,
      },
      create: {
        key: item.key,
        label: item.label,
        unit: item.unit,
      },
    });

    measurementTypeMap[item.key] = record;
  }

  console.log(
    "[AI Seed] Measurement types ready: " + measurementTypes.length
  );

  const brandMap = {};

  for (const item of brands) {
    const brand = await prisma.brand.upsert({
      where: {
        slug: item.slug,
      },
      update: {
        name: item.name,
      },
      create: {
        name: item.name,
        slug: item.slug,
      },
    });

    brandMap[item.slug] = brand;
  }

  console.log("[AI Seed] Brands ready: " + brands.length);

  let sizeCount = 0;
  let measurementCount = 0;

  for (const brand of Object.values(brandMap)) {
    for (const [garmentType, sizeData] of Object.entries(
      measurementTemplates
    )) {
      for (const sizeLabel of sizeLabels) {
        const values = sizeData[sizeLabel];

        const brandSize = await prisma.brandSize.upsert({
          where: {
            brandId_garmentType_sizeLabel: {
              brandId: brand.id,
              garmentType: garmentType,
              sizeLabel: sizeLabel,
            },
          },
          update: {},
          create: {
            brandId: brand.id,
            garmentType: garmentType,
            sizeLabel: sizeLabel,
          },
        });

        sizeCount++;

        for (const [measurementKey, value] of Object.entries(values)) {
          const measurementType = measurementTypeMap[measurementKey];

          await prisma.brandSizeMeasurement.upsert({
            where: {
              brandSizeId_measurementTypeId: {
                brandSizeId: brandSize.id,
                measurementTypeId: measurementType.id,
              },
            },
            update: {
              value: value,
            },
            create: {
              brandSizeId: brandSize.id,
              measurementTypeId: measurementType.id,
              value: value,
            },
          });

          measurementCount++;
        }
      }
    }
  }

  console.log("[AI Seed] Brand sizes ready: " + sizeCount);
  console.log("[AI Seed] Measurements ready: " + measurementCount);
  console.log("[AI Seed] Completed successfully.");
}

main()
  .catch((error) => {
    console.error("[AI Seed] Failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
