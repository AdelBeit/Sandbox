import React, { useState } from "react";
import CartItems from "./CartItems";
import PriceSummary from "./PriceSummary";

const Cart = props => {
  const [state, setState] = useState({
    cartItems: [
      { id: 1, text: "shoe", count: 2, price: 30 },
      { id: 2, text: "hat", count: 3, price: 10 },
      { id: 3, text: "glove", count: 0, price: 30 }
    ]
  });

  // increase or decrease cart item count based on change event
  const handleChangeCount = (cartItem, changeEvent) => {
    const cartItems = [...state.cartItems];
    const index = cartItems.indexOf(cartItem);
    cartItems[index] = { ...cartItem };
    // change item count based on event
    changeEvent === "increase"
      ? cartItems[index].count++
      : cartItems[index].count--;
    cartItems[index].count = Math.max(cartItems[index].count, 1);
    setState({ cartItems });
  };

  // delete a cart item based on id
  const handleDelete = itemId => {
    const cartItems = state.cartItems.filter(item => item.id !== itemId);
    setState({ cartItems });
  };

  return (
    <div>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>

        <CartItems
          cartItems={state.cartItems}
          onChangeCount={handleChangeCount}
          onDelete={handleDelete}
        />
      </table>
      <table className="table">
        <PriceSummary
          tax={10}
          subTotal={state.cartItems.reduce((acc, curr) => {
            return acc + curr.price * curr.count;
          }, 0)}
        />
      </table>
    </div>
  );
};

export default Cart;
