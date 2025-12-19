# Trade-offs and Design Decisions

This document explains the key trade-offs made during development.

## Framework Choice: React Native CLI vs Expo

**Chosen**: React Native CLI

**Pros**:
- Full control over native code
- No dependency on Expo servers
- Smaller bundle size
- Access to any native module

**Trade-offs**:
- More complex setup (Xcode, Android Studio required)
- Manual linking of some native modules
- No OTA updates out of the box

**Rationale**: For a production app that may need native integrations in the future, CLI provides more flexibility.

## State Management: React Context vs Redux

**Chosen**: React Context with useReducer

**Pros**:
- No additional dependencies
- Simpler setup and less boilerplate
- Built into React
- Sufficient for cart-level complexity

**Trade-offs**:
- No middleware support (no redux-thunk equivalent)
- No built-in devtools
- May not scale well for very complex state

**Rationale**: Cart state is simple (add, remove, update quantity). Context + useReducer provides the right level of structure without Redux overhead.

## Navigation: React Navigation vs React Native Navigation

**Chosen**: React Navigation with Native Stack

**Pros**:
- Widely adopted, excellent documentation
- Native Stack provides native performance
- TypeScript support is excellent
- Active maintenance

**Trade-offs**:
- Native Stack requires react-native-screens
- Some advanced gestures require additional configuration

**Rationale**: React Navigation is the de facto standard with great TypeScript support.

## API Approach: fetch vs axios

**Chosen**: Native fetch API

**Pros**:
- No additional dependency
- Works identically on both platforms
- Supports all HTTP methods and headers

**Trade-offs**:
- No automatic retry
- No request/response interceptors built-in
- No automatic JSON parsing (minor)

**Rationale**: For simple REST calls, fetch is sufficient. axios would add dependency without significant benefit.

## Testing: Jest + Maestro vs Detox

**Chosen**: Jest for unit tests, Maestro for E2E

**Pros of Maestro**:
- Simple YAML-based test definitions
- Works on both iOS and Android
- Fast test execution
- Great for CI/CD integration

**Trade-offs**:
- Maestro is newer, smaller community than Detox
- Less granular control than Detox
- Requires Maestro CLI installation

**Rationale**: Maestro's simplicity and cross-platform support made it ideal for the assessment scope.

## Image Loading: Built-in Image vs FastImage

**Chosen**: React Native's built-in Image component

**Pros**:
- No additional dependency
- Adequate caching on both platforms
- Simple API

**Trade-offs**:
- Less aggressive caching than FastImage
- No priority loading
- Limited cache control

**Rationale**: For this product search use case, built-in Image performance is acceptable.

## Styling: StyleSheet vs Styled Components

**Chosen**: React Native StyleSheet

**Pros**:
- No additional dependency
- Native optimization
- Consistent with React Native ecosystem

**Trade-offs**:
- No theming support built-in
- Styles not colocated with components
- No dynamic styles without conditional logic

**Rationale**: StyleSheet is standard practice and avoids adding complexity.

## Search Debouncing: Custom Hook vs lodash.debounce

**Chosen**: Custom useDebounce hook

**Pros**:
- No lodash dependency
- React-idiomatic implementation
- Easy to customize

**Trade-offs**:
- Slightly more code
- No cancel/flush functionality

**Rationale**: Custom hook is minimal and avoids adding lodash to bundle.

## Performance Optimizations

### FlatList Configuration

- `initialNumToRender={10}`: Balances initial render time vs scroll smoothness
- `maxToRenderPerBatch={5}`: Prevents frame drops during scroll
- `windowSize={5}`: Memory efficient while maintaining smooth scroll

### Component Memoization

- `useCallback` for event handlers prevents unnecessary re-renders
- `keyExtractor` uses SKU for stable keys

## Future Improvements (Out of Scope)

1. **Offline Support**: AsyncStorage for cart persistence, offline-first architecture
2. **Image Caching**: Implement FastImage for better performance with many images
3. **Search History**: Store recent searches locally
4. **Error Boundary**: Add React error boundaries for graceful error handling
5. **Analytics**: Integrate analytics for user behavior tracking
6. **i18n**: Full internationalization support (currently English/French via API)
7. **Accessibility**: Enhanced VoiceOver/TalkBack support
