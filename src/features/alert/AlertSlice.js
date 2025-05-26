import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    showAlert:false,
    message:'',
    duration:3000,
    variant:'success'
}

const alertSlice = createSlice({
    name:"alert",
    initialState,
    reducers:{
        setShowAlert:(state,action)=>{
            state.showAlert = action.payload.alert;
            state.message = action.payload.message;
            state.variant = action.payload.variant
            state.duration = action.payload.duration
        }
    }
})

export const {setShowAlert} = alertSlice.actions;
export default alertSlice.reducer;