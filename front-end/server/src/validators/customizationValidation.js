const SUPPORTED_GARMENT_TYPES = new Set([
  "TSHIRT",
  "SHIRT",
  "HOODIE",
  "SWEATSHIRT",
  "JACKET",
  "PANTS",
  "SHORTS",
]);

const FASHION_KEYWORDS = [
  "shirt",
  "t-shirt",
  "tshirt",
  "hoodie",
  "sweatshirt",
  "jacket",
  "pants",
  "shorts",
  "garment",
  "clothing",
  "wear",
  "embroider",
  "embroidery",
  "color",
  "colour",
  "fit",
  "oversized",
  "slim",
  "regular",
  "design",
  "graphic",
  "pattern",
  "fabric",
  "sleeve",
  "collar",
  "pocket",
];

function isMeaningfulPrompt(prompt) {
  if (typeof prompt !== "string") {
    return false;
  }

  const normalized = prompt.trim().toLowerCase();

  if (normalized.length < 10) {
    return false;
  }

  const vaguePrompts = [
    "make it nice",
    "make it good",
    "make it better",
    "make something",
    "do it",
    "anything",
    "something nice",
  ];

  return !vaguePrompts.includes(normalized);
}

function isFashionPrompt(prompt) {
  if (typeof prompt !== "string") {
    return false;
  }

  const normalized = prompt.toLowerCase();

  return FASHION_KEYWORDS.some((keyword) =>
    normalized.includes(keyword)
  );
}

export function validateCustomizationInput(input = {}) {
  const { garmentType, creativePrompt } = input;

  if (!SUPPORTED_GARMENT_TYPES.has(garmentType)) {
    return {
      valid: false,
      code: "UNSUPPORTED_GARMENT_TYPE",
      message: "The selected garment type is not supported.",
    };
  }

  if (!isMeaningfulPrompt(creativePrompt)) {
    return {
      valid: false,
      code: "AMBIGUOUS_PROMPT",
      message: "Please provide more details about the customization.",
    };
  }

  if (!isFashionPrompt(creativePrompt)) {
    return {
      valid: false,
      code: "UNSUPPORTED_PROMPT",
      message: "The prompt must describe a fashion customization.",
    };
  }

  return {
    valid: true,
    code: "VALID_CUSTOMIZATION_INPUT",
    data: {
      ...input,
      garmentType,
      creativePrompt: creativePrompt.trim(),
    },
  };
}

export function validateParsedCustomization(parsed = {}) {
  const requiredFields = [
    "garmentType",
    "creativePrompt",
    "color",
    "fit",
    "style",
    "design",
  ];

  const missingFields = requiredFields.filter((field) => {
    const value = parsed[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missingFields.length > 0) {
    return {
      valid: false,
      code: "INCOMPLETE_LLM_OUTPUT",
      message: "The LLM output is missing required customization fields.",
      missingFields,
    };
  }

  return {
    valid: true,
    code: "VALID_LLM_OUTPUT",
    data: parsed,
  };
}
