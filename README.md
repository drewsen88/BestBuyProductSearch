# Best Buy Product Search

A React Native mobile application for searching and browsing products from Best Buy Canada.

## Features

- **Product Search**: Search products by keyword with debounced input
- **Product List**: View search results with product image, title, and price
- **Product Details**: View detailed product information with high-resolution image and description
- **Add to Cart**: Add products to a shopping cart with visual feedback
- **Sale Pricing**: Display sale prices with original price strikethrough

## Screenshots

| Search Results | Product Details | Add to Cart |
|----------------|-----------------|-------------|
| Product list with thumbnails, titles, prices | Full product view with large image | Green "In Cart" button state |

## Development Tools & Dependencies

### Core Technologies
| Tool | Version | Purpose |
|------|---------|---------|
| React Native | 0.83.0 | Cross-platform mobile framework |
| TypeScript | 5.0.4 | Type-safe JavaScript |
| Node.js | 18+ | JavaScript runtime |

### Key Dependencies
| Library | Purpose |
|---------|---------|
| @react-navigation/native | Navigation framework |
| @react-navigation/native-stack | Stack navigation |
| react-native-safe-area-context | Safe area handling |
| react-native-screens | Native navigation screens |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Jest | Unit testing |
| TypeScript | Type checking |

### Build Tools
| Platform | Tool |
|----------|------|
| iOS | Xcode 15+, CocoaPods |
| Android | Android Studio, Gradle |

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **Xcode**: 15+ (for iOS development)
- **Android Studio**: With Android SDK installed
- **CocoaPods**: For iOS dependencies
- **Watchman**: (recommended) For file watching

## Installation & Build Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/drewsen88/BestBuyProductSearch.git
cd BestBuyProductSearch

# Install dependencies
npm install

# Install iOS pods
cd ios && pod install && cd ..
```

### 2. Running on iOS Simulator

```bash
# Start Metro bundler
npm start

# In another terminal, run on iOS
npm run ios
```

### 3. Running on Android Emulator

```bash
# Start Metro bundler
npm start

# In another terminal, run on Android
npm run android
```

### 4. Building APK (Android)

```bash
# Navigate to android folder
cd android

# Build debug APK
./gradlew assembleDebug

# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

### 5. Running on Physical Device

**iOS:**
1. Open `ios/BestBuyProductSearch.xcworkspace` in Xcode
2. Select your device as the build target
3. Press Run (Cmd+R)

**Android:**
1. Enable USB debugging on your device
2. Connect via USB
3. Run `npm run android`

## Running Tests

```bash
# Unit tests
npm test

# Lint check
npm run lint

# TypeScript check
npx tsc --noEmit
```

## Project Structure

```
src/
├── config/           # Configuration constants (API URLs, etc.)
├── data/
│   └── api/          # API client and types
├── domain/
│   └── models/       # Domain models and utility functions
├── hooks/            # Custom React hooks (useDebounce, useProductSearch, etc.)
├── presentation/
│   ├── components/   # Reusable UI components
│   ├── navigation/   # React Navigation setup
│   └── screens/      # Screen components
└── store/            # State management (cart context)
```

## Architecture & Design Patterns

### Separation of Concerns
- **Data Layer**: API client with typed responses
- **Domain Layer**: Business models and utility functions
- **Presentation Layer**: React components and screens
- **State Management**: React Context for cart functionality

### Design Patterns Used
- **Repository Pattern**: API client abstracts data fetching
- **Custom Hooks**: Encapsulate business logic (useProductSearch, useDebounce)
- **Presenter/Container Pattern**: Screens handle data, components handle display
- **Singleton**: API client instance

### Performance Considerations
- **Debounced Search**: 300ms delay to reduce API calls
- **Memoized Components**: ProductListItem wrapped with React.memo
- **Stable Keys**: FlatList uses SKU as keyExtractor
- **Abort Controllers**: Cancel in-flight requests on unmount
- **Image URL Optimization**: Thumbnail URLs upscaled to 500x500 for detail views

## API

The app uses the Best Buy Canada public API:

- **Search**: `GET https://www.bestbuy.ca/api/v2/json/search?lang=en&query={keyword}`
- **Details**: `GET https://www.bestbuy.ca/api/v2/json/product/{sku}?lang=en`

## Documentation

- [Architecture](docs/architecture.md) - Detailed architecture overview
- [Trade-offs](docs/tradeoffs.md) - Design decisions and trade-offs

## Deliverables

- [x] Source code in GitHub repository
- [x] APK at `android/app/build/outputs/apk/debug/app-debug.apk`
- [x] Build instructions (this README)
- [x] Unit tests with coverage
- [x] Architecture documentation

## Author

Drew Sen
