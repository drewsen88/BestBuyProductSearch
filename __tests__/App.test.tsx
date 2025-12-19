/**
 * Domain model unit tests
 */

import {
  getDisplayPrice,
  isOnSale,
  formatPrice,
  stripHtml,
  Product,
} from '../src/domain/models';

describe('Product utilities', () => {
  const mockProduct: Product = {
    sku: '12345',
    name: 'Test Product',
    shortDescription: 'A test product',
    regularPrice: 99.99,
    salePrice: null,
    thumbnailImage: 'http://example.com/thumb.jpg',
    highResImage: 'http://example.com/high.jpg',
    customerRating: 4.5,
    customerRatingCount: 100,
  };

  const saleProduct: Product = {
    ...mockProduct,
    salePrice: 79.99,
  };

  describe('getDisplayPrice', () => {
    it('returns regular price when no sale price', () => {
      expect(getDisplayPrice(mockProduct)).toBe(99.99);
    });

    it('returns sale price when available', () => {
      expect(getDisplayPrice(saleProduct)).toBe(79.99);
    });
  });

  describe('isOnSale', () => {
    it('returns false when no sale price', () => {
      expect(isOnSale(mockProduct)).toBe(false);
    });

    it('returns true when sale price is lower', () => {
      expect(isOnSale(saleProduct)).toBe(true);
    });

    it('returns false when sale price equals regular price', () => {
      const samePriceProduct = {...mockProduct, salePrice: 99.99};
      expect(isOnSale(samePriceProduct)).toBe(false);
    });
  });

  describe('formatPrice', () => {
    it('formats price with dollar sign and two decimals', () => {
      expect(formatPrice(99.99)).toBe('$99.99');
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(0.5)).toBe('$0.50');
    });
  });

  describe('stripHtml', () => {
    it('removes HTML tags', () => {
      expect(stripHtml('<p>Hello</p>')).toBe('Hello');
      expect(stripHtml('<b>Bold</b> and <i>italic</i>')).toBe('Bold and italic');
    });

    it('converts HTML entities', () => {
      expect(stripHtml('&amp;')).toBe('&');
      expect(stripHtml('&lt;tag&gt;')).toBe('<tag>');
      expect(stripHtml('&quot;quoted&quot;')).toBe('"quoted"');
      expect(stripHtml('&#39;apostrophe&#39;')).toBe("'apostrophe'");
      expect(stripHtml('&nbsp;space&nbsp;')).toBe('space');
    });

    it('normalizes whitespace', () => {
      expect(stripHtml('  multiple   spaces  ')).toBe('multiple spaces');
      expect(stripHtml('line\n\nbreaks')).toBe('line breaks');
    });
  });
});
