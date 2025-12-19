/**
 * Navigation types
 * Type-safe navigation parameter definitions
 */

export type RootStackParamList = {
  Search: undefined;
  ProductDetails: {sku: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
