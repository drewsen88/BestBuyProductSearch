/**
 * ProductDetailsScreen
 * Shows detailed product information and add to cart functionality
 */

import React, {useCallback, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useProductDetails} from '../../hooks';
import {useCart} from '../../store';
import {getDisplayPrice, formatPrice, isOnSale, stripHtml, getHighResImageUrl} from '../../domain/models';
import {RootStackParamList} from '../navigation/types';
import {LoadingIndicator, ErrorView} from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const {width: screenWidth} = Dimensions.get('window');

export function ProductDetailsScreen({route}: Props) {
  const {sku} = route.params;
  const {product, isLoading, error, refresh} = useProductDetails(sku);
  const {addItem, isInCart} = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const addedToCartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      if (addedToCartTimeoutRef.current) {
        clearTimeout(addedToCartTimeoutRef.current);
      }
    };
  }, []);

  const inCart = product ? isInCart(product.sku) : false;

  const handleAddToCart = useCallback(() => {
    if (product) {
      addItem(product);
      setAddedToCart(true);
      // Clear any existing timeout before setting a new one
      if (addedToCartTimeoutRef.current) {
        clearTimeout(addedToCartTimeoutRef.current);
      }
      // Reset the "added" state after animation
      addedToCartTimeoutRef.current = setTimeout(() => setAddedToCart(false), 2000);
    }
  }, [product, addItem]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator message="Loading product details..." />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView
          message={error || 'Product not found'}
          onRetry={refresh}
        />
      </SafeAreaView>
    );
  }

  const displayPrice = getDisplayPrice(product);
  const onSale = isOnSale(product);

  // Use highResImage with fallback to upscaled thumbnailImage (500x500)
  const imageUrl = product.highResImage || getHighResImageUrl(product.thumbnailImage);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="product-details-scroll">
        <Image
          source={{uri: imageUrl}}
          style={styles.image}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          testID="product-image"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title} testID="product-detail-title">
            {product.name}
          </Text>

          <View style={styles.priceContainer}>
            <Text
              style={[styles.price, onSale && styles.salePrice]}
              testID="product-detail-price">
              {formatPrice(displayPrice)}
            </Text>
            {onSale && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.regularPrice)}
              </Text>
            )}
          </View>

          {product.customerRating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>
                {'★'.repeat(Math.round(product.customerRating))}
                {'☆'.repeat(5 - Math.round(product.customerRating))}
              </Text>
              <Text style={styles.ratingCount}>
                ({product.customerRatingCount} reviews)
              </Text>
            </View>
          )}

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description} testID="product-description">
            {stripHtml(product.longDescription || product.shortDescription)}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            (inCart || addedToCart) && styles.addedToCartButton,
          ]}
          onPress={handleAddToCart}
          testID="add-to-cart-button"
          accessibilityRole="button"
          accessibilityLabel={
            inCart ? 'Added to cart' : 'Add to cart'
          }
          accessibilityState={{selected: inCart}}>
          <Text
            style={[
              styles.addToCartText,
              (inCart || addedToCart) && styles.addedToCartText,
            ]}>
            {addedToCart ? '✓ Added to Cart' : inCart ? 'In Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  image: {
    width: screenWidth,
    height: screenWidth,
    backgroundColor: '#F5F5F5',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  salePrice: {
    color: '#E31837',
  },
  originalPrice: {
    fontSize: 18,
    color: '#888888',
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: '#FFB800',
  },
  ratingCount: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  addToCartButton: {
    backgroundColor: '#0046BE',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addedToCartButton: {
    backgroundColor: '#28A745',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  addedToCartText: {
    color: '#FFFFFF',
  },
});
