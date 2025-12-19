/**
 * ProductListItem Component
 * Displays a product card in the search results list
 */

import React, {memo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  AccessibilityProps,
} from 'react-native';
import {Product, getDisplayPrice, formatPrice, isOnSale} from '../../domain/models';
import {Config} from '../../config';

interface ProductListItemProps {
  product: Product;
  onPress: (product: Product) => void;
}

function ProductListItemComponent({product, onPress}: ProductListItemProps) {
  const displayPrice = getDisplayPrice(product);
  const onSale = isOnSale(product);

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: `${product.name}, ${formatPrice(displayPrice)}${onSale ? ', on sale' : ''}`,
    accessibilityHint: 'Double tap to view product details',
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(product)}
      testID={`product-item-${product.sku}`}
      {...accessibilityProps}>
      <Image
        source={{uri: product.thumbnailImage}}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
        defaultSource={require('../../assets/placeholder.png')}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2} testID="product-title">
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, onSale && styles.salePrice]} testID="product-price">
            {formatPrice(displayPrice)}
          </Text>
          {onSale && (
            <Text style={styles.originalPrice}>
              {formatPrice(product.regularPrice)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  image: {
    width: Config.ui.imageSize.thumbnail,
    height: Config.ui.imageSize.thumbnail,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  salePrice: {
    color: '#E31837',
  },
  originalPrice: {
    fontSize: 14,
    color: '#888888',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
});

export const ProductListItem = memo(ProductListItemComponent);
