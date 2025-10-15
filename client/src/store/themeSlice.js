import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    darkMode: localStorage.getItem("darkMode") === "true",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            document.documentElement.classList.toggle("dark", state.darkMode);
            localStorage.setItem("darkMode", state.darkMode);
        }
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
