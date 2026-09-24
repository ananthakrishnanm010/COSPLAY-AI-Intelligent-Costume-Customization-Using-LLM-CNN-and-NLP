require("dotenv").config();

const { Pool } = require("pg");
const { generateEmbedding } = require("./services/ragService");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const documents = [
  {
    id: "rag-test-1",
    content:
      "Nike hoodie size guide: For a loose fit, choose based on chest and height measurements. A 96 cm chest and 178 cm height can be used to determine the appropriate hoodie size.",
    brand: "Nike",
    garment: "Hoodie",
    documentType: "size_guide",
  },
  {
    id: "rag-test-2",
    content:
      "Adidas hoodie size guide: Hoodie sizes are based on chest, height, and preferred fit.",
    brand: "Adidas",
    garment: "Hoodie",
    documentType: "size_guide",
  },
  {
    id: "rag-test-3",
    content:
      "Nike pants size guide: Nike pants sizing uses waist, hip, and inseam measurements.",
    brand: "Nike",
    garment: "Pants",
    documentType: "size_guide",
  },
];

async function seedDocuments() {
  try {
    for (const doc of documents) {
      console.log(`Generating embedding for ${doc.brand} ${doc.garment}...`);

      const embedding = await generateEmbedding(doc.content);
      const vectorString = `[${embedding.join(",")}]`;

      await pool.query(
        `
        INSERT INTO "RagDocument"
        ("id", "content", "embedding", "brand", "garment", "documentType")
        VALUES ($1, $2, $3::vector, $4, $5, $6)
        `,
        [
          doc.id,
          doc.content,
          vectorString,
          doc.brand,
          doc.garment,
          doc.documentType,
        ]
      );

      console.log(`Inserted: ${doc.brand} ${doc.garment}`);
    }

    console.log("All test documents inserted successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await pool.end();
  }
}

seedDocuments();
