import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from '../../api/axiosInstance';

const initialState = {
    fetchChatroomStatus: 'idle',
    fetchSingleChatroomStatus: 'idle',
    fetchOldMessageStatus:'idle',
    isChatStart: false,
    chatroomId: null,
    chatType: 'single',
    singleChatroomDetail: null,
    sendMessageError: null,
    sendMessageStatus: "idle",
    chatroomPagination: {
        currentPage: 1,
        totalPages: 1,
        limit: 12,
        totalItems: 0
    },
    allChatrooms: []
}

export const fetchChatrooms = createAsyncThunk('chatroom/list', async (payload, thunkAPI) => {
    try {
        const res = await axiosInstance.get(`/chatroom?search=${payload.search || ''}`);

        return res.data

    } catch (error) {
        console.log("error in fetchChatrooms function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "fetchChatrooms failed")

    }
})

export const fetchSingleChatroom = createAsyncThunk('chatroom/single', async (payload, thunkAPI) => {

    let { chatType = 'single' } = payload;

    try {
        let res;

        if (chatType === 'single') {
            res = await axiosInstance.get(`/chatroom/${payload.id}`);
        }

        else {
            res = await axiosInstance.get(`/group/${payload.id}`);
        }

        return res.data

    } catch (error) {
        console.log("error in fetchSingleChatroom function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "fetchSingleChatroom failed")

    }
})

export const fetchOlderMessages = createAsyncThunk('chatroom/fetchOlderMessages', async (payload, thunkAPI) => {

    let { chatType = 'single',limit=10,page=2 } = payload;

    try {
        let res;

        if (chatType === 'single') {
            res = await axiosInstance.get(`/chatroom/${payload.id}?limit=${limit}&page=${page}`);
        }

        else {
            res = await axiosInstance.get(`/group/${payload.id}`);
        }

        return res.data

    } catch (error) {
        console.log("error in fetchOlderMessages function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "fetchOlderMessages failed")

    }
})

export const sendMessageInRoom = createAsyncThunk('chatroom/sendMessage', async (payload, thunkAPI) => {
    let { chatType = 'single' } = payload;

    try {
        let res = await axiosInstance.post(`/chatroom/${payload.roomId}/send`, payload.messageBody)

        return res.data

    } catch (error) {
        console.log("error in sendMessageInRoom function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "sendMessageInRoom failed")

    }
})

const chatroomSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        resetStatusAndErrors: (state, action) => {
            state.fetchChatroomStatus = 'idle';
            state.fetchSingleChatroomStatus = 'idle';
            state.sendMessageError = null,
                state.sendMessageStatus = 'idle'
        },
        startChat: (state, action) => {
            state.isChatStart = true;
            state.chatroomId = action.payload.id;
            state.chatType = action.payload.type
        },
        resetChatroomDetail: (state) => {
            state.singleChatroomDetail = null;
            state.fetchSingleChatroomStatus = 'idle';
            state.chatroomId = null;
        },
        inCommingMessage: (state, action) => {
            state.singleChatroomDetail.messages.push(action.payload.message);
        },
        markMessageSeen: (state, action) => {
            const {messageIds} = action.payload;
            state.singleChatroomDetail.messages = state.singleChatroomDetail.messages.map(msg => messageIds.includes(msg._id.toString()) ? { ...msg, seen: true } : msg)
        },
        unReadIncomingMessage: (state, action) => {
            const message = action.payload.message;
            const type = action.payload.type;
            const index = state.allChatrooms.findIndex(room => room._id.toString() === message.chatRoomId.toString());

            if (index !== -1) {

                if (type === 'unread') {
                    state.allChatrooms[index].unreadMessageCount = (state.allChatrooms[index].unreadMessageCount || 0) + 1;
                    state.allChatrooms[index].currentMessage = message
                }
                state.allChatrooms.sort((a, b) => {
                    const unreadDiff = (b.unreadMessageCount || 0) - (a.unreadMessageCount || 0);

                    if (unreadDiff !== 0) {
                        return unreadDiff;
                    }

                    const aTime = a.currentMessage?.createdAt ? new Date(a.currentMessage.createdAt).getTime() : 0;
                    const bTime = b.currentMessage?.createdAt ? new Date(b.currentMessage.createdAt).getTime() : 0;

                    return bTime - aTime; // Newer messages come first
                });

            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatrooms.pending, (state) => {
                state.fetchChatroomStatus = 'loading'
            })
            .addCase(fetchChatrooms.fulfilled, (state, action) => {
                state.fetchChatroomStatus = 'success';
                state.allChatrooms = action.payload.data.allChatrooms
            })
            .addCase(fetchSingleChatroom.pending, (state) => {
                state.fetchSingleChatroomStatus = 'loading'
            })
            .addCase(fetchSingleChatroom.fulfilled, (state, action) => {
                state.fetchSingleChatroomStatus = 'success';
                state.singleChatroomDetail = action.payload.data.chatroom;

                const { page, totalPages, total, limit } = action.payload.data;

                state.chatroomPagination = {
                    ...state.chatroomPagination,
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    limit
                }

                const index = state.allChatrooms.findIndex(room => room._id.toString() === state.singleChatroomDetail._id.toString());

                if (index !== -1) {
                    state.allChatrooms[index].unreadMessageCount = 0
                    // state.allChatrooms.sort((a,b)=> b.unreadMessageCount-a.unreadMessageCount)
                }


            })
            .addCase(sendMessageInRoom.pending, (state) => {
                state.sendMessageStatus = 'loading'
            })
            .addCase(sendMessageInRoom.fulfilled, (state, action) => {
                state.sendMessageStatus = 'success';
                state.singleChatroomDetail.messages.push(action.payload.data.message)


                const index = state.allChatrooms.findIndex(room => room._id.toString() === state.singleChatroomDetail._id.toString());

                if (index !== -1) {

                    state.allChatrooms[index].currentMessage = action.payload.data.message;
                    state.allChatrooms.sort((a, b) => {
                        const aTime = a.currentMessage?.createdAt ? new Date(a.currentMessage.createdAt).getTime() : 0;
                        const bTime = b.currentMessage?.createdAt ? new Date(b.currentMessage.createdAt).getTime() : 0;
                        return bTime - aTime;
                    });
                }

            })
            .addCase(sendMessageInRoom.rejected, (state, action) => {
                state.sendMessageStatus = 'failed';
                state.sendMessageError = action.error.message

            })
            .addCase(fetchOlderMessages.pending, (state) => {
                state.fetchOldMessageStatus = 'loading'
            })
            .addCase(fetchOlderMessages.fulfilled, (state, action) => {
                state.fetchOldMessageStatus = 'success';

                const { page, totalPages, total, limit,chatroom } = action.payload.data;

                state.singleChatroomDetail.messages = [...state.singleChatroomDetail.messages,...chatroom.messages]

                state.chatroomPagination = {
                    ...state.chatroomPagination,
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    limit
                }
            })
    }
})

export const { resetStatusAndErrors, startChat, resetChatroomDetail, inCommingMessage, unReadIncomingMessage,markMessageSeen } = chatroomSlice.actions


export default chatroomSlice.reducer