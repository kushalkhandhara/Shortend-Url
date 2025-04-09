import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js"
import linkReducer from "./links/linkSlice.js"

const store = configureStore({
    reducer : {
        auth : authReducer,
        links : linkReducer
    }
})

export default store;