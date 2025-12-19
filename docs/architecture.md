# Architecture

This document describes the architecture of the Best Buy Product Search app.

## Overview

The application follows a clean architecture pattern with clear separation of concerns across multiple layers:

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│  (Screens, Components, Navigation)                  │
├─────────────────────────────────────────────────────┤
│                   Hooks Layer                        │
│  (Custom hooks for business logic)                  │
├─────────────────────────────────────────────────────┤
│                   Domain Layer                       │
│  (Models, Business logic utilities)                 │
├─────────────────────────────────────────────────────┤
│                    Data Layer                        │
│  (API client, DTOs, Data transformation)            │
├─────────────────────────────────────────────────────┤
│                  Config Layer                        │
│  (Configuration constants)                          │
└─────────────────────────────────────────────────────┘
```

## Layers

### Config Layer (`/src/config`)

Centralizes all configurable values:
- API endpoints and base URLs
- Supported languages
- UI configuration (debounce timing, image sizes)

This layer ensures no hard-coded values are scattered throughout the codebase.

### Domain Layer (`/src/domain/models`)

Contains:
- **Product interface**: Core product entity
- **ProductDetails interface**: Extended product with additional fields
- **Utility functions**: `getDisplayPrice()`, `isOnSale()`, `formatPrice()`, `stripHtml()`

The domain layer is framework-agnostic and contains pure TypeScript.

### Data Layer (`/src/data/api`)

Handles all external data operations:
- **BestBuyClient**: Typed API client with error handling
- **Response types**: API-specific DTOs
- **Data transformation**: Maps API responses to domain models

The API client uses `fetch` with proper headers for Best Buy Canada's requirements.

### Hooks Layer (`/src/hooks`)

Custom React hooks encapsulate business logic:
- **useDebounce**: Debounces values with configurable delay
- **useProductSearch**: Manages search state, debouncing, and API calls
- **useProductDetails**: Fetches and caches product details

### Presentation Layer (`/src/presentation`)

#### Components (`/components`)
Reusable UI components:
- **SearchInput**: Text input with clear button
- **ProductListItem**: Product card for list display
- **LoadingIndicator**: Loading spinner with message
- **ErrorView**: Error display with retry button
- **EmptyState**: Placeholder for empty states

#### Screens (`/screens`)
Full-screen components:
- **SearchScreen**: Main search interface with FlatList
- **ProductDetailsScreen**: Product detail view with add-to-cart

#### Navigation (`/navigation`)
React Navigation configuration:
- **RootNavigator**: Native stack navigator setup
- **types.ts**: TypeScript type definitions for routes

### Store Layer (`/src/store`)

State management using React Context:
- **CartProvider**: Context provider for cart state
- **useCart hook**: Access cart actions and state
- **Reducer pattern**: Predictable state updates

## Data Flow

```
User Input → SearchScreen
    ↓
useProductSearch (debounce)
    ↓
BestBuyClient.searchProducts()
    ↓
API Response → Domain Models
    ↓
FlatList renders ProductListItems
    ↓
User taps item
    ↓
Navigation to ProductDetailsScreen
    ↓
useProductDetails fetches details
    ↓
User taps Add to Cart
    ↓
CartProvider.addItem()
```

## Key Design Decisions

1. **React Navigation Native Stack**: Chosen for native performance and smooth transitions.

2. **React Context for Cart**: Simple cart state doesn't require Redux complexity.

3. **Custom Hooks**: Encapsulate all async logic and state management, keeping components clean.

4. **FlatList with Optimization**: Uses `keyExtractor`, `initialNumToRender`, and memoized render functions for performance.

5. **TypeScript Throughout**: Full type safety from API responses to UI components.

## Extensibility Points

- **Config**: Easy to add new languages or adjust API endpoints
- **API Client**: Simple to add new endpoints or modify request handling
- **Cart Store**: Ready for persistence (AsyncStorage) or backend sync
- **Components**: Designed for reuse and easy styling changes
