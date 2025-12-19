/**
 * Application configuration
 * Centralizes all configurable values to avoid hard-coding
 */

export const Config = {
  api: {
    baseUrl: 'https://www.bestbuy.ca/api/v2/json',
    defaultLanguage: 'en' as const,
    supportedLanguages: ['en', 'fr', 'fr-ca'] as const,
  },
  search: {
    debounceMs: 400,
    minQueryLength: 2,
  },
  ui: {
    imageSize: {
      thumbnail: 150,
      detail: 500,
    },
  },
} as const;

export type SupportedLanguage = (typeof Config.api.supportedLanguages)[number];
