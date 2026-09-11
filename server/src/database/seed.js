import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seed...');

  // 1. Clean existing records in dependency order
  console.log('[Seed] Cleaning database...');
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  console.log('[Seed] Seeding users...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@threadandform.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@threadandform.com',
      password: customerPassword,
      name: 'John Doe',
      role: 'customer',
    },
  });

  console.log(`[Seed] Created Users: admin (${admin.email}), customer (${customer.email})`);

  // 3. Seed Categories
  console.log('[Seed] Seeding categories...');
  const categoriesData = [
    { name: 'Shirts', slug: 'shirts' },
    { name: 'Pants', slug: 'pants' },
    { name: 'Jackets', slug: 'jackets' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Footwear', slug: 'footwear' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: cat,
    });
    categories[cat.slug] = createdCat;
  }
  console.log(`[Seed] Seeded ${Object.keys(categories).length} categories.`);

  // 4. Seed Products and Variants
  console.log('[Seed] Seeding products & variants...');

  const productsData = [
    {
      name: 'Relaxed Cotton Shirt',
      slug: 'relaxed-cotton-shirt',
      description:
        'A premium, breathable relaxed cotton shirt designed for everyday comfort and clean style.',
      price: 45.0,
      compareAtPrice: 55.0,
      categorySlug: 'shirts',
      images: [
        '/assets/images/relaxed-cotton-shirt-1.jpg',
        '/assets/images/relaxed-cotton-shirt-2.jpg',
      ],
      variants: [
        { size: 'S', color: 'Linen White', sku: 'SH-COT-LW-S', inventory: 15 },
        { size: 'M', color: 'Linen White', sku: 'SH-COT-LW-M', inventory: 25 },
        { size: 'L', color: 'Linen White', sku: 'SH-COT-LW-L', inventory: 20 },
      ],
    },
    {
      name: 'Oversized Heavyweight Tee',
      slug: 'oversized-heavyweight-tee',
      description:
        'Constructed from 280gsm combed cotton with a clean boxy fit and durable ribbed collar.',
      price: 35.0,
      categorySlug: 'shirts',
      images: ['/assets/images/heavyweight-tee-1.jpg'],
      variants: [
        { size: 'S', color: 'Charcoal', sku: 'SH-TEE-CH-S', inventory: 30 },
        { size: 'M', color: 'Charcoal', sku: 'SH-TEE-CH-M', inventory: 40 },
        { size: 'L', color: 'Charcoal', sku: 'SH-TEE-CH-L', inventory: 35 },
      ],
    },
    {
      name: 'Tailored Linen Trousers',
      slug: 'tailored-linen-trousers',
      description:
        'Lightweight, breathable tailored linen trousers featuring a classic tapered profile.',
      price: 85.0,
      compareAtPrice: 95.0,
      categorySlug: 'pants',
      images: ['/assets/images/linen-trousers-1.jpg'],
      variants: [
        { size: 'M', color: 'Natural Tan', sku: 'PA-LIN-NT-M', inventory: 12 },
        { size: 'L', color: 'Natural Tan', sku: 'PA-LIN-NT-L', inventory: 18 },
      ],
    },
    {
      name: 'Minimalist Trench Coat',
      slug: 'minimalist-trench-coat',
      description:
        'A water-resistant classic double-breasted trench coat with modern sleek belt detailing.',
      price: 180.0,
      categorySlug: 'jackets',
      images: ['/assets/images/trench-coat-1.jpg'],
      variants: [
        { size: 'M', color: 'Classic Beige', sku: 'JA-TRE-CB-M', inventory: 8 },
        { size: 'L', color: 'Classic Beige', sku: 'JA-TRE-CB-L', inventory: 10 },
      ],
    },
    {
      name: 'Wool Ribbed Beanie',
      slug: 'wool-ribbed-beanie',
      description:
        'Extra-fine merino wool ribbed knit beanie, styled for perfect cold-weather warmth.',
      price: 28.0,
      categorySlug: 'accessories',
      images: ['/assets/images/ribbed-beanie-1.jpg'],
      variants: [{ size: 'OS', color: 'Ink Black', sku: 'AC-BEA-IB-OS', inventory: 50 }],
    },
    {
      name: 'Classic Leather Loafers',
      slug: 'classic-leather-loafers',
      description:
        'Handcrafted Italian leather loafers featuring full leather linings and durable stack heels.',
      price: 140.0,
      compareAtPrice: 165.0,
      categorySlug: 'footwear',
      images: ['/assets/images/leather-loafers-1.jpg'],
      variants: [
        { size: '41', color: 'Ebony Brown', sku: 'FO-LOA-EB-41', inventory: 5 },
        { size: '42', color: 'Ebony Brown', sku: 'FO-LOA-EB-42', inventory: 8 },
        { size: '43', color: 'Ebony Brown', sku: 'FO-LOA-EB-43', inventory: 6 },
      ],
    },
  ];

  for (const prod of productsData) {
    const category = categories[prod.categorySlug];

    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        categoryId: category.id,
        images: prod.images,
        variants: {
          create: prod.variants,
        },
      },
    });
  }

  console.log(`[Seed] Seeded ${productsData.length} products and their variants.`);

  // 5. Seed Coupons
  console.log('[Seed] Seeding coupons...');
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10.0,
        minPurchase: 50.0,
        expiryDate: nextYear,
        usageLimit: 500,
      },
      {
        code: 'SUMMER20',
        discountType: 'fixed',
        discountValue: 20.0,
        minPurchase: 100.0,
        expiryDate: nextYear,
        usageLimit: 100,
      },
    ],
  });

  console.log('[Seed] Database seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('[Seed] Database seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
