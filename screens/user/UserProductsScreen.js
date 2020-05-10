import React from 'react';
import { FlatList, Button, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = (id) => {
    props.navigation.navigate('EditProduct', { productId: id });
  };

  return (
    <FlatList
      keyExtractor={item => item.id}
      data={userProducts}
      renderItem={itemData => {
        return(
          <ProductItem
            item={itemData.item}
            onSelect={() => {
                editProductHandler(itemData.item.id)
              }}
          >
            <Button
              color={Colors.primary}
              title="Edit"
              onPress={() => {
                editProductHandler(itemData.item.id)
              }}
            />
            <Button
              color={Colors.primary}
              title="Delete"
              onPress={() => {
                dispatch(productsActions.deleteProduct(itemData.item.id))
              }}
            />
          </ProductItem>
        )
      }}
    />
  )
};

UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your products',
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
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('EditProduct');
          }}
        />
      </HeaderButtons>
    )
  }
}
export default UserProductsScreen;