import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import Colors from '../../constants/Colors';

const CartScreen = props => {
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
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
    return transformedCartItems;
  });

  return(
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total:
          <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        <Button
          title="Order Now"
          color={Colors.accent}
          disabled={cartItems.length === 0}
        />
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <Text>{itemData.item.productTitle}</Text>
        )}
      />
      <View>
        <Text>Cart Items</Text>
      </View>
    </View>
  );
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
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white'
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