// Picks the image provider from the IMAGE_PROVIDER env var.
//   IMAGE_PROVIDER=gemini      (default, current behaviour)
//   IMAGE_PROVIDER=cloudflare
//
// Providers are loaded lazily, so the unused provider's keys are never required
// (geminiService.js throws at import time if GEMINI_API_KEY is missing).

const PROVIDERS = {
  gemini: () => import('./geminiService.js'),
  cloudflare: () => import('./cloudflareService.js'),
};

export async function generateDesignImage(args) {
  const name = (process.env.IMAGE_PROVIDER || 'gemini').trim().toLowerCase();
  const load = PROVIDERS[name];

  if (!load) {
    throw new Error(
      `Unknown IMAGE_PROVIDER "${name}". Use: ${Object.keys(PROVIDERS).join(' or ')}`
    );
  }

  const provider = await load();
  return provider.generateDesignImage(args);
}
