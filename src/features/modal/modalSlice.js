import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    showModal:false,
    messageId:null,
    isSender:false,
    roomId:null
}

const modalSlice = createSlice({
    name:"modal",
    initialState,
    reducers:{
        handleModalStatus:(state,action)=>{
            state.showModal = action.payload.show;
            state.messageId = action.payload.messageId || null;
            state.isSender = action.payload.isSender;
            state.roomId = action.payload.roomId;
        }
    }
})

export const {handleModalStatus} = modalSlice.actions;
export default modalSlice.reducer;