import React from "react";

const PriceSummary = props => {
  const { subTotal, tax } = props;

  return (
    <tbody>
      <tr>
        <td>Sub Total: {subTotal}</td>
      </tr>
      <tr>
        <td>Tax: {tax}</td>
      </tr>
      <tr>
        <td>Total: {subTotal + subTotal * tax}</td>
      </tr>
    </tbody>
  );
};

export default PriceSummary;
