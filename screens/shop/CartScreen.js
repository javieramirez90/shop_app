import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';

const CartScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const dispatch = useDispatch();
  const cartItems =  useSelector(state => {
    const transformedCartItems = [];
    for(const k in state.cart.items) {
      transformedCartItems.push({
        productId: k,
        productTitle: state.cart.items[k].productTitle,
        productPrice: state.cart.items[k].productPrice,
        quantity:  state.cart.items[k].quantity,
        sum: state.cart.items[k].sum
      });
    };
    return transformedCartItems.sort((a, b) => {
      return a.productId > b.productId ? 1 : -1;
    });
  });

  const sendOrderHandler = async () => {
    setIsLoading(true);
    const response = await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  }

  return(
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>Total:
          <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text>
        </Text>
        {
          isLoading ?
            <ActivityIndicator
              size="small"
              color={Colors.primary}
            /> :
            <Button
              title="Order Now"
              color={Colors.accent}
              disabled={cartItems.length === 0}
              onPress={sendOrderHandler}
            />
        }
      </Card>
      <FlatList
        keyExtractor={item => item.productId}
        data={cartItems}
        renderItem={itemData => (
          <CartItem
            item={itemData.item}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId))
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  },
});

export default CartScreen;