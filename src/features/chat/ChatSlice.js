import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from '../../api/axiosInstance';

const initialState = {
    fetchChatroomStatus: 'idle',
    fetchSingleChatroomStatus: 'idle',
    fetchOldMessageStatus: 'idle',
    isChatStart: false,
    chatroomId: null,
    chatType: 'single',
    singleChatroomDetail: null,
    sendMessageError: null,
    sendMessageStatus: "idle",
    deleteMessageStatus: "idle",
    deleteMessageError: null,
    editMessageStatus: "idle",
    editMessageError: null,
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

    let { chatType = 'single', limit = 10, page = 2 } = payload;

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

export const deleteMessage = createAsyncThunk('chatroom/deleteMessage', async (payload, thunkAPI) => {

    try {
        let res = await axiosInstance.delete(
            `/chatroom/${payload.roomId}/message/${payload.messageId}`,
            {
                data: { type: payload.type }
            }
        );

        return res.data

    } catch (error) {
        console.log("error in deleteMessage function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "deleteMessage failed")

    }
})

export const editMessage = createAsyncThunk('chatroom/editMessage', async (payload, thunkAPI) => {
    console.log("inside the editMessage thunk api====>", payload);

    try {
        let res = await axiosInstance.put(
            `/chatroom/${payload.roomId}/message/${payload.messageId}`,
            payload.data
        );

        return res.data

    } catch (error) {
        console.log("error in editMessage function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "editMessage failed")

    }
})

const chatroomSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        resetStatusAndErrors: (state, action) => {
            state.fetchChatroomStatus = 'idle';
            state.fetchSingleChatroomStatus = 'idle';
            state.sendMessageError = null;
            state.sendMessageStatus = 'idle';
            state.deleteMessageError = null;
            state.deleteMessageStatus = 'idle';
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

            // update current message received in chatlist of receiver...
            const index = state.allChatrooms.findIndex(room => room._id.toString() === state.singleChatroomDetail?._id.toString());
            if (index !== -1) {
                state.allChatrooms[index].currentMessage = action.payload.message
            }
        },
        markMessageSeen: (state, action) => {
            const { messageIds } = action.payload;
            state.singleChatroomDetail.messages = state.singleChatroomDetail.messages.map(msg => messageIds.includes(msg._id.toString()) ? { ...msg, seen: true } : msg)
        },
        deleteMessageSingleRoom: (state, action) => {
            const { messageId, roomId } = action.payload;
            if (state.singleChatroomDetail && state.singleChatroomDetail?._id.toString() === roomId.toString()) {
                const findIndex = state.singleChatroomDetail.messages.findIndex(msg => msg?._id.toString() === messageId?.toString());

                if (findIndex !== -1) {
                    let currentMessage = state.singleChatroomDetail.messages[findIndex]

                    state.singleChatroomDetail.messages[findIndex] = { ...currentMessage, isDeleted: true }
                }

                // update in allchatrooms list current message...
                const chatroomIndex = state.allChatrooms.findIndex(room => room._id.toString() === roomId.toString());

                console.log("chatroomIndex====", chatroomIndex);


                if (chatroomIndex !== -1 && state.allChatrooms[chatroomIndex]) {
                    let chatroom = state.allChatrooms[chatroomIndex];
                    console.log("chatroom====", chatroom);

                    if (chatroom && chatroom.currentMessage?._id.toString() === messageId.toString()) {
                        state.allChatrooms[chatroomIndex].currentMessage = { ...state.allChatrooms[chatroomIndex].currentMessage, isDeleted: true }
                    }
                }

            }
        },
        EditMessageSingleRoom: (state, action) => {
            const { messageId, roomId, editMessage } = action.payload;
            delete editMessage.type;
            console.log("editMessage==========", editMessage);

            if (state.singleChatroomDetail && state.singleChatroomDetail?._id.toString() === roomId.toString()) {
                const findIndex = state.singleChatroomDetail.messages.findIndex(msg => msg?._id.toString() === messageId?.toString());

                if (findIndex !== -1) {
                    let currentMessage = state.singleChatroomDetail.messages[findIndex]

                    state.singleChatroomDetail.messages[findIndex] = { ...currentMessage, isEdited: true, ...editMessage }
                }


            }

            // update in allchatrooms list current message...
            const chatroomIndex = state.allChatrooms.findIndex(room => room._id.toString() === roomId.toString());

            console.log("chatroomIndex====", chatroomIndex);


            if (chatroomIndex !== -1 && state.allChatrooms[chatroomIndex]) {
                let chatroom = state.allChatrooms[chatroomIndex];
                console.log("chatroom====", chatroom);

                if (chatroom && chatroom.currentMessage?._id.toString() === messageId.toString()) {
                    state.allChatrooms[chatroomIndex].currentMessage = { ...state.allChatrooms[chatroomIndex].currentMessage, ...editMessage }
                }
            }


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

                const { page, totalPages, total, limit, chatroom } = action.payload.data;

                state.singleChatroomDetail.messages = [...state.singleChatroomDetail.messages, ...chatroom.messages]

                state.chatroomPagination = {
                    ...state.chatroomPagination,
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    limit
                }
            })
            .addCase(deleteMessage.pending, (state) => {
                state.deleteMessageStatus = 'loading'
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.deleteMessageStatus = 'success';

                const { _id: messageId, roomId } = action.payload.data;

                if (state.singleChatroomDetail && state.singleChatroomDetail?._id.toString() === roomId.toString()) {

                    const findIndex = state.singleChatroomDetail.messages.findIndex(msg => msg?._id.toString() === messageId?.toString());
                    if (findIndex !== -1) {

                        state.singleChatroomDetail.messages[findIndex] = action.payload.data
                    }
                }

                // update in allchatrooms list current message...
                const chatroomIndex = state.allChatrooms.findIndex(room => room._id.toString() === state.singleChatroomDetail._id.toString());

                if (chatroomIndex !== -1 && state.allChatrooms[chatroomIndex]) {
                    let chatroom = state.allChatrooms[chatroomIndex];

                    if (chatroom && chatroom.currentMessage?._id.toString() === messageId.toString()) {
                        state.allChatrooms[chatroomIndex].currentMessage = action.payload.data;
                    }
                }


            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.deleteMessageStatus = 'failed';
                state.deleteMessageError = action.error.message
            })
            .addCase(editMessage.pending, (state) => {
                state.editMessageStatus = 'loading'
            })
            .addCase(editMessage.fulfilled, (state, action) => {
                state.editMessageStatus = 'success';

                const { _id: messageId, roomId } = action.payload.data;

                if (state.singleChatroomDetail && state.singleChatroomDetail?._id.toString() === roomId.toString()) {

                    const findIndex = state.singleChatroomDetail.messages.findIndex(msg => msg?._id.toString() === messageId?.toString());
                    if (findIndex !== -1) {

                        state.singleChatroomDetail.messages[findIndex] = action.payload.data
                    }
                }

                // // update in allchatrooms list current message...
                const chatroomIndex = state.allChatrooms.findIndex(room => room._id.toString() === state.singleChatroomDetail._id.toString());

                if (chatroomIndex !== -1 && state.allChatrooms[chatroomIndex]) {
                    let chatroom = state.allChatrooms[chatroomIndex];

                    if (chatroom && chatroom.currentMessage?._id.toString() === messageId.toString()) {
                        state.allChatrooms[chatroomIndex].currentMessage = action.payload.data;
                    }
                }


            })
            .addCase(editMessage.rejected, (state, action) => {
                state.editMessageStatus = 'failed';
                state.editMessageError = action.error.message
            })
    }
})

export const { resetStatusAndErrors, startChat, resetChatroomDetail, inCommingMessage, unReadIncomingMessage, markMessageSeen, deleteMessageSingleRoom, EditMessageSingleRoom } = chatroomSlice.actions


export default chatroomSlice.reducer