/**
 * SearchScreen
 * Main screen for searching products
 */

import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet, ListRenderItem} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Product} from '../../domain/models';
import {useProductSearch} from '../../hooks';
import {RootStackParamList} from '../navigation/types';
import {
  SearchInput,
  ProductListItem,
  LoadingIndicator,
  ErrorView,
  EmptyState,
} from '../components';
import {Config} from '../../config';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export function SearchScreen({navigation}: Props) {
  const {query, setQuery, products, isLoading, error, refresh} =
    useProductSearch();

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', {sku: product.sku});
    },
    [navigation],
  );

  const renderItem: ListRenderItem<Product> = useCallback(
    ({item}) => <ProductListItem product={item} onPress={handleProductPress} />,
    [handleProductPress],
  );

  const keyExtractor = useCallback((item: Product) => item.sku, []);

  const renderContent = () => {
    if (error) {
      return <ErrorView message={error} onRetry={refresh} />;
    }

    if (isLoading && products.length === 0) {
      return <LoadingIndicator message="Searching products..." />;
    }

    if (query.length < Config.search.minQueryLength) {
      return (
        <EmptyState
          title="Search Products"
          message="Enter at least 2 characters to search for products"
        />
      );
    }

    if (products.length === 0) {
      return (
        <EmptyState
          title="No Results"
          message={`No products found for "${query}". Try a different search term.`}
        />
      );
    }

    return (
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        testID="product-list"
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
        getItemLayout={(_, index) => ({
          length: Config.ui.imageSize.thumbnail + 24,
          offset: (Config.ui.imageSize.thumbnail + 24) * index,
          index,
        })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search products..."
      />
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
});
