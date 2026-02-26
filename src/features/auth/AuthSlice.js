import  {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import axiosInstance from '../../api/axiosInstance';

const initialState = {
    user:localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')):null,
    token:localStorage.getItem('token') || null,
    signupStatus:'idle',
    signupError:null,
    loginError:null,
    loginStatus:'idle',
}

export const signup = createAsyncThunk('auth/signup',async (data,thunkAPI)=>{
    
    try {

        const res = await axiosInstance.post('/authentication/signup',data);
        return res.data
        
    } catch (error) {
        console.log("error in signup function",error);
        throw new Error(error.response.data.message || error.response.data.errors || "Signup failed")
        
    }
})

export const login = createAsyncThunk('auth/login',async (credentials,thunkAPI)=>{
    
    try {

        const res = await axiosInstance.post('/authentication/login',credentials);
        return res.data
        
    } catch (error) {
        console.log("error in login function",error);
        throw new Error(error.response.data.message || error.response.data.errors || "Login failed")
        
    }
})

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.loginError = null;
        },
        resetStatusAndErrors:(state,action)=>{
            state.loginError = false;
            state.loginStatus = 'idle';
            state.signupError=null;
            state.signupStatus='idle'
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(signup.pending,(state)=>{
            state.signupStatus = 'loading'
        })
        .addCase(signup.fulfilled,(state,action)=>{
            state.signupStatus = 'success',
            state.signupError = null
            localStorage.setItem('token',action.payload.data.token);
            localStorage.setItem('user',JSON.stringify(action.payload.data.user));
            state.token = action.payload.data.token;
            state.user = action.payload.data.user
            
        })
        .addCase(signup.rejected,(state,action)=>{
            state.signupStatus = 'failed';
            state.signupError = action.error.message
            
        })
        .addCase(login.pending,(state)=>{
            state.loginStatus = 'loading'
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.loginStatus = 'success',
            state.loginError = null
            localStorage.setItem('token',action.payload.data.token);
            localStorage.setItem('user',JSON.stringify(action.payload.data.user));
            state.token = action.payload.data.token;
            state.user = action.payload.data.user
            
        })
        .addCase(login.rejected,(state,action)=>{
            state.loginStatus = 'failed';
            state.loginError = action.error.message
            
        })
    }
})

export const {logout,resetStatusAndErrors}  = authSlice.actions


export default authSlice.reducer