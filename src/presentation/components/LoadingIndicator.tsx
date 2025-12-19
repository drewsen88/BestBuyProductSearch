/**
 * LoadingIndicator Component
 * Displays a loading state
 */

import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({message = 'Loading...'}: LoadingIndicatorProps) {
  return (
    <View style={styles.container} testID="loading-indicator">
      <ActivityIndicator size="large" color="#0046BE" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
});
