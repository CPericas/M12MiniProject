import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { addItem, removeItem, checkout } from "../features/cart/cartSlice";

describe("cartSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { cart: cartReducer },
    });
  });

  test("should add an item to the cart", () => {
    store.dispatch(addItem({ id: 1, title: "Test Item", price: 10, image: "test.jpg" }));
    const state = store.getState().cart;

    expect(state.items[1]).toEqual({
      id: 1,
      title: "Test Item",
      price: 10,
      image: "test.jpg",
      quantity: 1,
    });
    expect(state.totalItems).toBe(1);
  });

  test("should remove an item from the cart", () => {
    store.dispatch(addItem({ id: 1, title: "Test Item", price: 10, image: "test.jpg" }));
    store.dispatch(removeItem({ id: 1 }));
    const state = store.getState().cart;

    expect(state.items[1]).toBeUndefined();
    expect(state.totalItems).toBe(0);
  });

  test("should clear cart on checkout", () => {
    store.dispatch(addItem({ id: 1, title: "Test Item", price: 10, image: "test.jpg" }));
    store.dispatch(checkout());
    const state = store.getState().cart;

    expect(state.items).toEqual({});
    expect(state.totalItems).toBe(0);
  });
});

