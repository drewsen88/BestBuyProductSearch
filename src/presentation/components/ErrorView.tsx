/**
 * ErrorView Component
 * Displays an error state with retry option
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({message, onRetry}: ErrorViewProps) {
  return (
    <View style={styles.container} testID="error-view">
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          testID="retry-button"
          accessibilityRole="button"
          accessibilityLabel="Retry">
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
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
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0046BE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
