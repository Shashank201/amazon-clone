import React from "react";
import CheckoutProduct from "./CheckoutProduct";
import { useStateValue } from "./StateProvider";
import { Link } from "react-router-dom";
import "./Payment.css";
function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>

        {/* Address */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user ? user.email : ""}</p>
            <p>24 React Lane</p>
            <p>Saket , India</p>
          </div>
        </div>

        {/* Review Items */}

        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket ? (
              basket.map((item, index) => (
                <CheckoutProduct
                  key={index}
                  id={item.id}
                  price={item.price}
                  title={item.title}
                  rating={item.rating}
                  image={item.image}
                />
              ))
            ) : (
              <p>no item found</p>
            )}
          </div>
        </div>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">{/* Stripe */}</div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
