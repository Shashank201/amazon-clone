import React from "react";
import "./Order.css";
import moment from "moment";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";

function Order({ order }) {
  return (
    <div className="order">
      <h2>Order</h2>

      <p>{moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")}</p>
      <p className="order__id">
        <small>{order.id}</small>
      </p>

      {order.data.basket
        ? order.data.basket.map((item, index) => (
            <CheckoutProduct
              key={index}
              id={item.id}
              price={item.price}
              title={item.title}
              rating={item.rating}
              image={item.image}
              hideButton
            />
          ))
        : ""}
      <CurrencyFormat
        renderText={(value) => (
          <React.Fragment>
            <p className="order__total">Order Total: {value}</p>
          </React.Fragment>
        )}
        decimalScale={2}
        value={order.data.amount / 100}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"₹"}
      />
    </div>
  );
}

export default Order;
