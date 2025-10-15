import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import loaderReducer from './loaderSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        loader: loaderReducer,
    }
});

export default store;
