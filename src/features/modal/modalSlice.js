import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showModal: false,
    messageId: null,
    isSender: false,
    roomId: null,
    isFileModalShow: false,
    editMessageModalShow: false,
    selectedMessage:null
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        handleModalStatus: (state, action) => {
            state.showModal = action.payload.show;
            state.messageId = action.payload.messageId || null;
            state.isSender = action.payload.isSender;
            state.roomId = action.payload.roomId;
        },
        handleFileUploadModal: (state, action) => {

            state.isFileModalShow = action.payload.isFileModalShow
        },
        handleEditMessageModal: (state, action) => {
            state.editMessageModalShow = action.payload.isShow;
            state.selectedMessage = action.payload.message || null;

        }
    }
})

export const { handleModalStatus, handleFileUploadModal,handleEditMessageModal } = modalSlice.actions;
export default modalSlice.reducer;