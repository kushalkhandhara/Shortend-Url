import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


// Initial State
const initialState = {
    isAuthenticated: false,
    isLoading: false,
    userId : "",
    token : null
}

// Register New USer
export const registerUser = createAsyncThunk("/auth/register",async(formData)=>{
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,formData,{
            withCredentials : true,
        });
        console.log("Register User : " + response.data);
        return response.data;

    }catch(error){
        console.log(error);
        return {
            error: true,
            message: error?.response?.data?.message || "Something went wrong",
            status: error?.response?.status || 500,
        };
    }
})


// Login User
export const loginUser = createAsyncThunk("/auth/login",async(formData)=>{
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,formData,{
            withCredentials : true,
        });
        console.log("Login User : ",response.data);
        return response.data;

    }catch(error){
        console.log("Error In Login : " + error );
 
        return {
            error: true,
            message: error?.response?.data?.message || "Something went wrong",
            status: error?.response?.status || 500,
        };
    }
})



// Check if token exists in localStorage
export const checkToken = createAsyncThunk("/auth/checkToken", async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
        return {
            isAuthenticated: true,
            token,
            userId
        };
    } else {
        // Return a fallback object indicating the user is not authenticated
        return {
            isAuthenticated: false,
            token: null,
            userId: ""
        };
    }
});



// auth Slice
const authSlice = createSlice({
    name : "auth",
    initialState,
 
    extraReducers : (builder)=>(
        
        // Register
        builder
        .addCase(registerUser.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isAuthenticated = action.payload?.success ? true :  false;
            state.userId = action.payload.userId;
            state.token = action.payload.token;
            if (state.token) {
                // Set 'authToken' in cookies with an expiration of 1 day
                const expires = new Date();
                expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 1 day from now
                document.cookie = `authToken=${state.token}; expires=${expires.toUTCString()}; path=/`;
            }
            
            if (state.userId) {
                // Set 'userId' in cookies with an expiration of 1 day
                const expires = new Date();
                expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 1 day from now
                document.cookie = `userId=${state.userId}; expires=${expires.toUTCString()}; path=/`;
            }
            
        })
        .addCase(registerUser.rejected,(state)=>{
            state.isLoading = false;
            state.userId = "";
            state.token = null;
            state.isAuthenticated = false;
         
        })

        // Login
        .addCase(loginUser.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isAuthenticated = action.payload?.success ? true :  false;
            state.userId = action.payload.userId;
            state.token = action.payload.token;
            if (state.token) {
                // Set 'authToken' in cookies with an expiration of 1 day
                const expires = new Date();
                expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 1 day from now
                document.cookie = `authToken=${state.token}; expires=${expires.toUTCString()}; path=/`;
            }
            
            if (state.userId) {
                // Set 'userId' in cookies with an expiration of 1 day
                const expires = new Date();
                expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 1 day from now
                document.cookie = `userId=${state.userId}; expires=${expires.toUTCString()}; path=/`;
            }
            
        })
        .addCase(loginUser.rejected,(state)=>{
            state.isLoading = false;
            state.userId = "";
            state.token = null;
            state.isAuthenticated = false;
          
        })
        // Check Token
        .addCase(checkToken.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(checkToken.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = action.payload?.isAuthenticated || false;
            state.userId = action.payload?.userId || "";
            state.token = action.payload?.token || null;
        })
        .addCase(checkToken.rejected, (state) => {
            state.isLoading = false;
            state.userId = "";
            state.token = null;
            state.isAuthenticated = false;
        })
 

    )
})


 
export default authSlice.reducer;
