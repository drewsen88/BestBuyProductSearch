/**
 * Best Buy Canada API Client
 * Typed API client with error handling
 */

import {Config, SupportedLanguage} from '../../config';
import {Product, ProductDetails} from '../../domain/models';
import {
  SearchApiResponse,
  ProductDetailsApiResponse,
  ApiProduct,
} from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Map API product to domain model
 */
function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  return {
    sku: apiProduct.sku,
    name: apiProduct.name,
    shortDescription: apiProduct.shortDescription,
    regularPrice: apiProduct.regularPrice,
    salePrice: apiProduct.salePrice,
    thumbnailImage: apiProduct.thumbnailImage,
    highResImage: apiProduct.highResImage,
    customerRating: apiProduct.customerRating,
    customerRatingCount: apiProduct.customerRatingCount,
  };
}

/**
 * Map API product details to domain model
 */
function mapApiProductDetailsToProductDetails(
  apiProduct: ProductDetailsApiResponse,
): ProductDetails {
  return {
    sku: apiProduct.sku,
    name: apiProduct.name,
    shortDescription: apiProduct.shortDescription,
    longDescription: apiProduct.longDescription || apiProduct.shortDescription,
    regularPrice: apiProduct.regularPrice,
    salePrice: apiProduct.salePrice,
    thumbnailImage: apiProduct.thumbnailImage,
    highResImage: apiProduct.highResImage,
    customerRating: apiProduct.customerRating,
    customerRatingCount: apiProduct.customerRatingCount,
    additionalMedia: apiProduct.additionalMedia || [],
  };
}

export interface SearchResult {
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}

class BestBuyApiClient {
  private baseUrl: string;
  private language: SupportedLanguage;

  constructor(
    baseUrl: string = Config.api.baseUrl,
    language: SupportedLanguage = Config.api.defaultLanguage,
  ) {
    this.baseUrl = baseUrl;
    this.language = language;
  }

  /**
   * Set the language for API requests
   */
  setLanguage(language: SupportedLanguage): void {
    this.language = language;
  }

  /**
   * Search products by keyword
   */
  async searchProducts(query: string, signal?: AbortSignal): Promise<SearchResult> {
    const url = `${this.baseUrl}/search?lang=${this.language}&query=${encodeURIComponent(query)}`;

    const response = await this.fetchWithErrorHandling<SearchApiResponse>(url, signal);

    return {
      products: response.products.map(mapApiProductToProduct),
      total: response.total,
      currentPage: response.currentPage,
      totalPages: response.totalPages,
    };
  }

  /**
   * Get product details by SKU
   */
  async getProductDetails(sku: string, signal?: AbortSignal): Promise<ProductDetails> {
    const url = `${this.baseUrl}/product/${sku}?lang=${this.language}`;

    const response =
      await this.fetchWithErrorHandling<ProductDetailsApiResponse>(url, signal);

    return mapApiProductDetailsToProductDetails(response);
  }

  /**
   * Generic fetch with error handling
   */
  private async fetchWithErrorHandling<T>(url: string, signal?: AbortSignal): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'BestBuyProductSearch/1.0',
        },
        signal,
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP error: ${response.statusText}`,
          response.status,
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
      );
    }
  }
}

// Export singleton instance
export const apiClient = new BestBuyApiClient();

// Export class for testing
export {BestBuyApiClient};
