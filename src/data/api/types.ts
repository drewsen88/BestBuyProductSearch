/**
 * API response types matching the Best Buy Canada API structure
 */

export interface SearchApiResponse {
  currentPage: number;
  total: number;
  totalPages: number;
  pageSize: number;
  products: ApiProduct[];
}

export interface ApiProduct {
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

export interface ProductDetailsApiResponse {
  sku: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  regularPrice: number;
  salePrice: number | null;
  thumbnailImage: string;
  highResImage: string;
  customerRating: number | null;
  customerRatingCount: number;
  additionalMedia: ApiProductMedia[];
}

export interface ApiProductMedia {
  thumbnailUrl: string;
  url: string;
  mimeType: string;
}
