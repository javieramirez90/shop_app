import React from 'react';
import { FlatList, Alert, Button, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const products = useSelector(state => state.products.availableProducts);
  const dispatch =  useDispatch();

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

  return(
    <FlatList
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

export default ProductsOverviewScreen;