import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";

const promise = loadStripe(
  "pk_test_51HnhmzLy3a6p9zZuT4h6XkGhOLv0BKOq9TWn0QltN21nbR0H3jVeMfvraqtGv1VvQsIWJCMzUPtaZosSe38fmo4y00U2XpebG9"
);

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    // will only run once the app reloads

    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>>>", authUser);

      if (authUser) {
        // if the user just logged In / user was logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // user logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
