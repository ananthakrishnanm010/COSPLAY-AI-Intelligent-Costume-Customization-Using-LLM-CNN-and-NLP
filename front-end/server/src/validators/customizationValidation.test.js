import test from "node:test";
import assert from "node:assert/strict";

import {
  validateCustomizationInput,
  validateParsedCustomization,
} from "./customizationValidation.js";

test("accepts a valid customization request", () => {
  const result = validateCustomizationInput({
    garmentType: "TSHIRT",
    creativePrompt:
      "Create a black oversized t-shirt with white embroidery on the chest.",
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.garmentType, "TSHIRT");
});

test("COS-48 rejects unsupported garment types", () => {
  const result = validateCustomizationInput({
    garmentType: "DRESS",
    creativePrompt: "Create a red embroidered garment.",
  });

  assert.equal(result.valid, false);
  assert.equal(result.code, "UNSUPPORTED_GARMENT_TYPE");
});

test("COS-47 rejects vague customization prompts", () => {
  const result = validateCustomizationInput({
    garmentType: "SHIRT",
    creativePrompt: "Make it nice",
  });

  assert.equal(result.valid, false);
  assert.equal(result.code, "AMBIGUOUS_PROMPT");
});

test("COS-47 rejects unsupported non-fashion requests", () => {
  const result = validateCustomizationInput({
    garmentType: "HOODIE",
    creativePrompt: "Create a website for me.",
  });

  assert.equal(result.valid, false);
  assert.equal(result.code, "UNSUPPORTED_PROMPT");
});

test("COS-46 rejects incomplete LLM output", () => {
  const result = validateParsedCustomization({
    garmentType: "SHIRT",
  });

  assert.equal(result.valid, false);
  assert.equal(result.code, "INCOMPLETE_LLM_OUTPUT");
});

test("COS-46 accepts complete LLM output", () => {
  const result = validateParsedCustomization({
    garmentType: "HOODIE",
    creativePrompt:
      "Create a navy oversized hoodie with a minimal white graphic.",
    color: "navy",
    fit: "oversized",
    style: "minimal",
    design: "white graphic",
  });

  assert.equal(result.valid, true);
  assert.equal(result.code, "VALID_LLM_OUTPUT");
});
