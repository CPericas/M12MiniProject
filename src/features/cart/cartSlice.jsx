import { createSlice } from "@reduxjs/toolkit";

const loadCartFromSession = () => {
    const savedCart = sessionStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: {}, totalItems: 0 };
};

const initialState = loadCartFromSession();

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const { id, title, price, image } = action.payload;
            if (state.items[id]) {
                state.items[id].quantity += 1;
            } else {
                state.items[id] = { id, title, price, image, quantity: 1 };
            }
            state.totalItems += 1;

            saveCartToSession(state);
        },
        removeItem: (state, action) => {
            const { id } = action.payload;
            if (state.items[id]) {
                state.items[id].quantity -= 1;
                if (state.items[id].quantity === 0) {
                    delete state.items[id];
                }
                state.totalItems -= 1;
            }

            saveCartToSession(state);
        },
        checkout: (state) => {
            state.items = {};
            state.totalItems = 0;

            sessionStorage.removeItem('cart');
        },
    },
});

const saveCartToSession = (state) => {
    if (state.totalItems > 0 || Object.keys(state.items).length > 0) {
        sessionStorage.setItem('cart', JSON.stringify(state));
    }
};

export const { addItem, removeItem, checkout } = cartSlice.actions;

export default cartSlice.reducer;
