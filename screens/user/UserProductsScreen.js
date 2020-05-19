import React from 'react';
import { View, Text, FlatList, Button, Alert, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const deleteHandler = itemData => {
    Alert.alert('Are you sure?', 'Do you really want to delete ', [
      {text: 'No', style:'default'},
      {text: 'Yes', style:'destructive', onPress: () => {
        dispatch(productsActions.deleteProduct(itemData.item.id))
      }}
    ])
  };

  const editProductHandler = (id) => {
    props.navigation.navigate('EditProduct', { productId: id });
  };

  if(userProducts.length === 0) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>No products found, maybe start createing some?</Text></View>
  }

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
              onPress={() => deleteHandler(itemData)}
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