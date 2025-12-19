/**
 * Best Buy Product Search App
 * React Native application for searching Best Buy Canada products
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './src/presentation/navigation';
import {CartProvider} from './src/store';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <RootNavigator />
      </CartProvider>
    </SafeAreaProvider>
  );
}

export default App;
