import React, { useState, useEffect, useCallback } from 'react';
// We use useCallback to avoid to fall in an infinite loop
import { View, FlatList, Alert, Button, ActivityIndicator, Platform, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const dispatch =  useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch(err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts()
    .then(() => setIsLoading(false))
  }, [dispatch, loadProducts]);

  useEffect(() => {
    // subscription
    const willFocusSub = props.navigation.addListener('willFocus', loadProducts);

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts ]);

  const seletItemHandler = (id, title) => {
    props.navigation.navigate(
      {
        routeName: 'ProductDetail',
        params: {
          productId: id,
          productTitle: title,
          }
      }
    )
  };

  if(error) {
    return (
      <View style={styles.spinner}>
        <Text>An error ocurred!</Text>
        <Button title="Reload" onPress={loadProducts} color={Colors.primary}/>
      </View>
    );
  }

  if(isLoading) {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />
      </View>
    );
  };

  if(!isLoading && products.length === 0) {
    return(
      <View style={styles.spinner}>
        <Text>No products found. Start adding some!</Text>
      </View>
    );
  };

  return(
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
      <ProductItem
        item={itemData.item}
        onSelect={() => {
          seletItemHandler(itemData.item.id, itemData.item.title)
        }}
      >
        <Button
          color={Colors.primary}
          title="View Details"
          onPress={() => {
          seletItemHandler(itemData.item.id, itemData.item.title)
        }}
        />
        <Button
          color={Colors.primary}
          title="To Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(itemData.item));
            Alert.alert(
              'Cart',
              `${itemData.item.title} added to cart`
            );
          }}
        />
      </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
      )
  };
}
const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ProductsOverviewScreen;