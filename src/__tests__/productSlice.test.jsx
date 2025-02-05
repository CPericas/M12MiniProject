import { configureStore } from "@reduxjs/toolkit";
import productsReducer, { fetchProducts } from "../features/products/productsSlice";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("fetchProducts async thunk", () => {
    let store;
    let mockAxios;

    beforeEach(() => {
        store = configureStore({ reducer: { products: productsReducer } });
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    test("fetches products successfully", async () => {
        mockAxios.onGet("https://fakestoreapi.com/products").reply(200, [
            { id: 1, title: "Product 1", price: 10, image: "img1.jpg" },
            { id: 2, title: "Product 2", price: 20, image: "img2.jpg" },
        ]);

        await store.dispatch(fetchProducts());

        const state = store.getState().products;
        expect(state.items).toHaveLength(2);
        expect(state.items[0].title).toBe("Product 1");
        expect(state.status).toBe("succeeded");
    });

    test("handles API failure", async () => {
        mockAxios.onGet("https://fakestoreapi.com/products").reply(500);

        await store.dispatch(fetchProducts());

        const state = store.getState().products;
        expect(state.status).toBe("failed");
        expect(state.error).toBeDefined();
    });
});
