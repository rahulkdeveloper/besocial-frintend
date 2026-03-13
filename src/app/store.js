import {configureStore} from '@reduxjs/toolkit';
import AlertReducer from '../features/alert/AlertSlice';
import AuthReducer from '../features/auth/AuthSlice';
import UserReducer from '../features/user/UserSlice';
import ContactReducer from '../features/user/ContactSlice';
import ChatRoomReducer from '../features/chat/ChatSlice';
import ModalReducer from '../features/modal/modalSlice';

export const store = configureStore({
    reducer:{
        alert:AlertReducer,
        auth:AuthReducer,
        user:UserReducer,
        contact:ContactReducer,
        chatroom:ChatRoomReducer,
        modal:ModalReducer
    }
})