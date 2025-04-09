import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

 

// Get User Links
export const getUserLinks = createAsyncThunk("/links/userLinks",async()=>{
    try{
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };
      
        // Check for 'authToken' and 'userId' in cookies
        const authToken = getCookie('authToken');
        const userId = getCookie('userId');

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/links/user/${userId}/links`, {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
        });
        console.log("Links : ",response.data);
        return response.data
          
    }catch(error){
        console.log(error)
        return {
            error: true,
            message: error?.response?.data?.message || "Something went wrong",
            status: error?.response?.status || 500,
        };
    }

})


// Get Link By UserId and Link By Id
export const getLinkById = createAsyncThunk("/link/userId",async(linkId)=>{
    try{
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        // Check for 'authToken' and 'userId' in cookies
        const authToken = getCookie('authToken');
        const userId = getCookie('userId');


        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/links/user/${userId}/link/${linkId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
        });
        console.log("Link : ",response.data);
        return response.data

    }catch(error){
        console.log(error);
        return {
            error: true,
            message: error?.response?.data?.message || "Something went wrong",
            status: error?.response?.status || 500,
        };
    }
})


// Redirect to Link
export const clickOnLink = createAsyncThunk("/link/click",async(shortUrl)=>{
    try{ 
        let urlObject = new URL(shortUrl);
        let pathSegment = urlObject.pathname.split('/').filter(Boolean).pop();
        console.log(pathSegment);   
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/${pathSegment}`)
        console.log("Response : ",response);
        return response.data
    }catch(error){
        console.log(error);
        return {
            error: true,
            message: error?.response?.data?.message || "Something went wrong",
            status: error?.response?.status || 500,
        };
    }
})


// Create Link
export const createLink = createAsyncThunk("/createLink",async(formData)=>{
    try{
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        // Check for 'authToken' and 'userId' in cookies
        const authToken = getCookie('authToken');
        console.log("Auth Token : ",authToken)

        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/links/create`,
            formData,  
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            }
        );
          

        return response.data;
    }catch(error){
        console.log(error)
        return {
            error: true,
            message: error?.response?.data?.message || "Something went wrong",
            status: error?.response?.status || 500,
        };
    }

})

const linkSlice = createSlice({
    name: "links",

    initialState: { 
        loading: false,
    },

    reducers: {
        // You can add any sync reducers here, if needed
    },

    extraReducers: (builder) => {
        // Get User Links
        builder
            .addCase(getUserLinks.pending, (state) => {
                state.loading = true;
              
            })
            .addCase(getUserLinks.fulfilled, (state, action) => {
                state.loading = false;
              
            })
            .addCase(getUserLinks.rejected, (state, action) => {
                state.loading = false;
                
            });

        // Get Link By Id
        builder
            .addCase(getLinkById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLinkById.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getLinkById.rejected, (state, action) => {
                state.loading = false;
            });

        // Click on Link (redirect action)
        builder
            .addCase(clickOnLink.pending, (state) => {
                state.loading = true;
            })
            .addCase(clickOnLink.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(clickOnLink.rejected, (state, action) => {
                state.loading = false;
            });

        // Create Link
        builder
            .addCase(createLink.pending, (state) => {
                state.loading = true;
            })
            .addCase(createLink.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createLink.rejected, (state, action) => {
                state.loading = false;
            });
    }
});

export default linkSlice.reducer;
