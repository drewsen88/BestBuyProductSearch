/**
 * Product domain models
 * Represents the core product entity used throughout the app
 */

export interface Product {
  sku: string;
  name: string;
  shortDescription: string;
  regularPrice: number;
  salePrice: number | null;
  thumbnailImage: string;
  highResImage: string;
  customerRating: number | null;
  customerRatingCount: number;
}

export interface ProductDetails extends Product {
  longDescription: string;
  additionalMedia: ProductMedia[];
}

export interface ProductMedia {
  thumbnailUrl: string;
  url: string;
  mimeType: string;
}

/**
 * Get the display price (sale price if available, otherwise regular price)
 */
export function getDisplayPrice(product: Product): number {
  return product.salePrice ?? product.regularPrice;
}

/**
 * Check if product is on sale
 */
export function isOnSale(product: Product): boolean {
  return product.salePrice !== null && product.salePrice < product.regularPrice;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Strip HTML tags from text
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get a higher resolution image URL from Best Buy's CDN
 * Converts thumbnail URL (55x55) to specified size (default 500x500)
 */
export function getHighResImageUrl(
  thumbnailUrl: string,
  size: '150x150' | '250x250' | '500x500' | '1500x1500' = '500x500',
): string {
  return thumbnailUrl.replace(/\/\d+x\d+\//, `/${size}/`);
}
