import React from "react";

const CartItem = (props) => {
  const { cartItem, onChangeCount, onDelete } = props;

  const getBadgeClasses = () => {
    let classes = "btn btn-sm badge-";
    classes += cartItem.count === 0 ? "warning" : "primary";
    return classes;
  };

  const formatCount = () => {
    const count = cartItem.count;
    return count === 0 ? "Zero" : count;
  };

  return (
    <tr>
      <td>
        <span className="h5">{cartItem.text}</span>
      </td>
      <td>
        <span className="h6">${cartItem.price * cartItem.count}.00</span>
      </td>
      <td>
        <span className="btn btn-sm badge-primary">{cartItem.count}</span>
        <button
          className="btn-secondary btn-sm"
          onClick={() => {
            onChangeCount(cartItem, "increase");
          }}
        >
          +
        </button>
        <button
          className="btn-secondary btn-sm"
          onClick={() => {
            onChangeCount(cartItem, "decrease");
          }}
        >
          -
        </button>
        <button
          className="btn-danger btn-sm"
          onClick={() => onDelete(cartItem.id)}
        >
          X
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
