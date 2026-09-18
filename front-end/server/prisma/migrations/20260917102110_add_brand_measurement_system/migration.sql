-- CreateEnum
CREATE TYPE "GarmentType" AS ENUM ('SHIRT', 'TSHIRT', 'JEANS', 'HOODIE');

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementType" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'inch',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeasurementType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandSize" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "garmentType" "GarmentType" NOT NULL,
    "sizeLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandSizeMeasurement" (
    "id" TEXT NOT NULL,
    "brandSizeId" TEXT NOT NULL,
    "measurementTypeId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandSizeMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementType_key_key" ON "MeasurementType"("key");

-- CreateIndex
CREATE UNIQUE INDEX "BrandSize_brandId_garmentType_sizeLabel_key" ON "BrandSize"("brandId", "garmentType", "sizeLabel");

-- CreateIndex
CREATE UNIQUE INDEX "BrandSizeMeasurement_brandSizeId_measurementTypeId_key" ON "BrandSizeMeasurement"("brandSizeId", "measurementTypeId");

-- AddForeignKey
ALTER TABLE "BrandSize" ADD CONSTRAINT "BrandSize_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandSizeMeasurement" ADD CONSTRAINT "BrandSizeMeasurement_brandSizeId_fkey" FOREIGN KEY ("brandSizeId") REFERENCES "BrandSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandSizeMeasurement" ADD CONSTRAINT "BrandSizeMeasurement_measurementTypeId_fkey" FOREIGN KEY ("measurementTypeId") REFERENCES "MeasurementType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
