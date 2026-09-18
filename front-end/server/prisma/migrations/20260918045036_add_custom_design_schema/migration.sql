-- CreateTable
CREATE TABLE "CustomDesign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "garmentType" "GarmentType" NOT NULL,
    "designPrompt" TEXT NOT NULL,
    "referenceImages" TEXT[],
    "baseBrandSizeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomDesignAlteration" (
    "id" TEXT NOT NULL,
    "customDesignId" TEXT NOT NULL,
    "measurementTypeId" TEXT NOT NULL,
    "alterationType" TEXT NOT NULL,
    "adjustment" DOUBLE PRECISION NOT NULL,
    "baseValue" DOUBLE PRECISION NOT NULL,
    "finalValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDesignAlteration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomDesignAlteration_customDesignId_idx" ON "CustomDesignAlteration"("customDesignId");

-- CreateIndex
CREATE INDEX "CustomDesignAlteration_measurementTypeId_idx" ON "CustomDesignAlteration"("measurementTypeId");

-- AddForeignKey
ALTER TABLE "CustomDesign" ADD CONSTRAINT "CustomDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomDesign" ADD CONSTRAINT "CustomDesign_baseBrandSizeId_fkey" FOREIGN KEY ("baseBrandSizeId") REFERENCES "BrandSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomDesignAlteration" ADD CONSTRAINT "CustomDesignAlteration_customDesignId_fkey" FOREIGN KEY ("customDesignId") REFERENCES "CustomDesign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomDesignAlteration" ADD CONSTRAINT "CustomDesignAlteration_measurementTypeId_fkey" FOREIGN KEY ("measurementTypeId") REFERENCES "MeasurementType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
