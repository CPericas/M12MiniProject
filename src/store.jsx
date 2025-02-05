import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import productsReducer from './features/products/productsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});


// store - central hub for our application state
// reducer - similar to our "set" hooks. Define how our state changes
// Slices - breaks our state into more manageable pieces