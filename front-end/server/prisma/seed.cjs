
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

/**
 * Parse CSV while correctly handling quoted fields
 * containing commas.
 */
function parseCSV(content) {
  const rows = [];
  let row = [];
  let field = "";
  let insideQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      field += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }

      row.push(field.trim());
      field = "";

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      field += char;
    }
  }

  // Handle final field/row
  if (field !== "" || row.length > 0) {
    row.push(field.trim());

    if (row.some((value) => value !== "")) {
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0];

  return rows.slice(1).map((values) => {
    const record = {};

    headers.forEach((header, index) => {
      record[header] = values[index] ?? "";
    });

    return record;
  });
}

/**
 * Convert CSV garment type to Prisma enum.
 *
 * CSV:
 * Shirt
 * Tshirt
 * Jeans
 * Hoodie
 *
 * Prisma:
 * SHIRT
 * TSHIRT
 * JEANS
 * HOODIE
 */
function convertGarmentType(value) {
  const normalized = value.trim().toUpperCase();

  const validTypes = ["SHIRT", "TSHIRT", "JEANS", "HOODIE"];

  if (!validTypes.includes(normalized)) {
    throw new Error(`Invalid garment type: ${value}`);
  }

  return normalized;
}

/**
 * Create a URL-friendly brand slug.
 */
function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Measurement columns in the CSV.
 *
 * Only numeric values will be inserted because
 * BrandSizeMeasurement.value is a Prisma Float.
 */
const measurementColumns = [
  {
    csvColumn: "chest_bust_in",
    key: "chest_bust",
    label: "Chest / Bust",
  },
  {
    csvColumn: "waist_in",
    key: "waist",
    label: "Waist",
  },
  {
    csvColumn: "hip_seat_in",
    key: "hip_seat",
    label: "Hip / Seat",
  },
  {
    csvColumn: "length_in",
    key: "length",
    label: "Length",
  },
  {
    csvColumn: "shoulder_in",
    key: "shoulder",
    label: "Shoulder",
  },
  {
    csvColumn: "sleeve_in",
    key: "sleeve",
    label: "Sleeve",
  },
  {
    csvColumn: "inseam_in",
    key: "inseam",
    label: "Inseam",
  },
];

async function main() {
  console.log("========================================");
  console.log("Brand Size Chart Seeder");
  console.log("========================================");

  const csvPath = path.join(
    __dirname,
    "..",
    "data",
    "brand_size_charts.csv"
  );

  console.log(`CSV file: ${csvPath}`);

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found:\n${csvPath}`);
  }

  const content = fs.readFileSync(csvPath, "utf8");

  const rows = parseCSV(content);

  console.log(`CSV rows found: ${rows.length}`);

  if (rows.length === 0) {
    throw new Error("CSV file contains no data.");
  }

  let brandsCreated = 0;
  let sizesCreated = 0;
  let measurementsCreated = 0;

  /*
   * Process every CSV row.
   */
  for (const row of rows) {
    const brandName = row.brand?.trim();
    const garmentType = convertGarmentType(row.garment_type);
    const sizeLabel = row.size_label?.trim();

    if (!brandName || !sizeLabel) {
      console.warn("Skipping row with missing brand or size:", row);
      continue;
    }

    /*
     * 1. Create/find Brand
     */
    const brand = await prisma.brand.upsert({
      where: {
        name: brandName,
      },
      update: {},
      create: {
        name: brandName,
        slug: createSlug(brandName),
      },
    });

    /*
     * 2. Create/find BrandSize
     */
    const existingBrandSize = await prisma.brandSize.findUnique({
      where: {
        brandId_garmentType_sizeLabel: {
          brandId: brand.id,
          garmentType: garmentType,
          sizeLabel: sizeLabel,
        },
      },
    });

    const brandSize =
      existingBrandSize ||
      (await prisma.brandSize.create({
        data: {
          brandId: brand.id,
          garmentType: garmentType,
          sizeLabel: sizeLabel,
        },
      }));

    if (!existingBrandSize) {
      sizesCreated++;
    }

    /*
     * 3. Process each measurement column.
     */
    for (const measurement of measurementColumns) {
      const rawValue = row[measurement.csvColumn]?.trim();

      /*
       * Empty measurement → nothing to insert.
       */
      if (!rawValue) {
        continue;
      }

      const numericValue = Number(rawValue);

      /*
       * Values such as:
       * 30/32
       * 30/32/34
       *
       * are not valid Float values, so skip them.
       */
      if (!Number.isFinite(numericValue)) {
        console.warn(
          `Skipping non-numeric ${measurement.key} value "${rawValue}" ` +
            `for ${brandName} ${garmentType} ${sizeLabel}`
        );
        continue;
      }

      /*
       * 4. Create/find MeasurementType
       */
      const measurementType = await prisma.measurementType.upsert({
        where: {
          key: measurement.key,
        },
        update: {
          label: measurement.label,
          unit: "inch",
        },
        create: {
          key: measurement.key,
          label: measurement.label,
          unit: "inch",
        },
      });

      /*
       * 5. Create/update BrandSizeMeasurement
       */
      const existingMeasurement =
        await prisma.brandSizeMeasurement.findUnique({
          where: {
            brandSizeId_measurementTypeId: {
              brandSizeId: brandSize.id,
              measurementTypeId: measurementType.id,
            },
          },
        });

      if (existingMeasurement) {
        await prisma.brandSizeMeasurement.update({
          where: {
            id: existingMeasurement.id,
          },
          data: {
            value: numericValue,
          },
        });
      } else {
        await prisma.brandSizeMeasurement.create({
          data: {
            brandSizeId: brandSize.id,
            measurementTypeId: measurementType.id,
            value: numericValue,
          },
        });

        measurementsCreated++;
      }
    }
  }

  console.log("");
  console.log("========================================");
  console.log("Seeding completed successfully!");
  console.log("========================================");
  console.log(`CSV rows processed: ${rows.length}`);
  console.log(`New sizes created: ${sizesCreated}`);
  console.log(`New measurements created: ${measurementsCreated}`);
  console.log("========================================");
}

main()
  .catch((error) => {
    console.error("");
    console.error("========================================");
    console.error("SEEDING FAILED");
    console.error("========================================");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

