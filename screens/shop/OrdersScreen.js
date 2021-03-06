import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(ordersActions.fecthOrders())
    .then(() => setIsLoading(false))
  }, [useDispatch]);

  if(isLoading) {
    <View style={styles.spinner}>
      <ActivityIndicator
        size="large"
        color={Colors.primary}
      />
    </View>
  }

  if(orders.length === 0) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>No orders found, maybe start ordering some?</Text></View>
  }
  return (
    <FlatList
      keyExtractor={item => item.id}
      data={orders}
      renderItem={itemData => (
        <OrderItem
          item={itemData.item}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Orders',
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
  }
};

const styles = StyleSheet.create({
  spinner:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default OrdersScreen;