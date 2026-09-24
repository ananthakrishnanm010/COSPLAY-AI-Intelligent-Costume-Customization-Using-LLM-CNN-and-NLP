require("dotenv").config();

const { retrieveRelevantDocuments } = require("./services/ragService");

async function testRetrieval() {
  try {
    console.log("Testing RAG retrieval...\n");

    const documents = await retrieveRelevantDocuments({
     brand: "Nike",
garment: "Pants",
      chest: 96,
      height: 178,
      fit: "Loose",
      topK: 3,
    });

    console.log("Retrieved documents:\n");
    console.log(JSON.stringify(documents, null, 2));
  } catch (error) {
    console.error("? Retrieval test failed:", error.message);
  }
}

testRetrieval();
