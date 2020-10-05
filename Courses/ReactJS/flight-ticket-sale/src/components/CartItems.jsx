import React from "react";
import CartItem from "./CartItem";

const CartItems = props => {
  const { cartItems, onChangeCount, onDelete } = props;

  return (
    <tbody className="light">
      {cartItems.map(cartItem => (
        <CartItem
          cartItem={cartItem}
          onChangeCount={onChangeCount}
          onDelete={onDelete}
          key={cartItem.id}
        />
      ))}
    </tbody>
  );
};

export default CartItems;
