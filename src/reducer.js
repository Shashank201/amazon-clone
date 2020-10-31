export const initialState = {
  basket: [],
  price: 0,
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_TO_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.item],
        price: state.price + action.item.price,
      };
    default:
      return state;
  }
};

export default reducer;
