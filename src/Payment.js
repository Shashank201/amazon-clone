import React, { useEffect, useState } from "react";
import CheckoutProduct from "./CheckoutProduct";
import { useStateValue } from "./StateProvider";
import { Link, useHistory } from "react-router-dom";
import "./Payment.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios";
import { db } from "./firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();

  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    // generate special stripe secret which allows us to charge client
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        //Stripe expects the subtotal in currency subunit , thats why * 100
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      setClientSecret(response.data.clientSecret);
    };

    getClientSecret();
  }, [basket]);

  console.log("THE SECRET IS :>>>", clientSecret);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error) {
    } else {
      setProcessing(true);

      const payload = await stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        })
        .then(({ paymentIntent }) => {
          //PaymentIntent is PaymentConfirmation

          db.collection("users")
            .doc(user?.uid)
            .collection("orders")
            .doc(paymentIntent.id)
            .set({
              basket: basket,
              amount: paymentIntent.amount,
              created: paymentIntent.created,
            });

          setSucceeded(true);
          setError(null);
          setProcessing(false);

          dispatch({
            type: "EMPTY_BASKET",
          });

          history.replace("/orders");
        });
    }
  };

  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (
          <Link to="/checkout">{basket ? basket.length : ""} items</Link>)
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
          <div className="payment__details">
            {/* Stripe */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <React.Fragment>
                      <h4>Order Total: {value}</h4>
                    </React.Fragment>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₹"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span> {processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
                {error && <div>{error}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
