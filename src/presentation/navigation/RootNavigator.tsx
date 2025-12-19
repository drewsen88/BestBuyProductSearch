/**
 * RootNavigator
 * Main navigation stack configuration
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {SearchScreen, ProductDetailsScreen} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0046BE',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}>
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Best Buy',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            title: 'Product Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
