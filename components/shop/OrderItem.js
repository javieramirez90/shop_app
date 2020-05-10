import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import CartItem from './CartItem';
import Card from '../UI/Card';
import Colors from '../../constants/Colors';

const OrderItem = props => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>$ {props.item.totalAmount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.item.readableDate}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={!showDetails ? 'Show Details' : 'Hide Details'}
        onPress={()=> {
          setShowDetails(!showDetails)
        }}
      />
      { showDetails && ( <View style={styles.detailItems}>
        { props.item.items.map(cartItem => (
          <CartItem
            key={cartItem.productId}
            item={cartItem}
          /> )
        )}
      </View> )}
    </Card>
  )
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16
  },
  date: {
    fontSize: 16,
    fontFamily: 'open-sans',
    color: '#888'
  },
  detailItems: {
    width: '100%'
  }
});

export default OrderItem;