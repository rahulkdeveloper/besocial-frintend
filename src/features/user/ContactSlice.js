import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from '../../api/axiosInstance';
import { updateUserContactStatus } from '../user/UserSlice'

const initialState = {
    contactList: [],
    myFriendList: [],
    friendRequestStatus: 'idle',
    friendRequestError: null,
    updateFriendRequestStatus: "",
    updateUserContactError: null,
    // friendRequestlist:[],
    contactListStatus: 'idle',
    contactListError: null,
    myFriendFetchStatus: 'idle',
    pagination: {
        currentPage: 1,
        totalPages: 1,
        limit: 12,
        totalItems: 0
    },
    myFriendsPagination: {
        currentPage: 1,
        totalPages: 1,
        limit: 12,
        totalItems: 0
    }
}

export const friendRequestList = createAsyncThunk('contact/friendRequests', async (payload, thunkAPI) => {
    console.log("insdie the friendRequestList function", payload);

    try {
        const res = await axiosInstance.get(`/contact/list?status=pending&limit=${payload.limit}&page=${payload.page}`);

        return res.data

    } catch (error) {
        console.log("error in friendRequestList function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "friendRequestList failed")

    }
})

export const myFriends = createAsyncThunk('contact/friends', async (payload, thunkAPI) => {
    console.log("insdie the myFriends function", payload);

    try {
        const res = await axiosInstance.get(`/contact/freinds?limit=${payload.limit}&page=${payload.page}&search=${payload.search || ''}`);

        return res.data

    } catch (error) {
        console.log("error in myFriends function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "myFriends failed")

    }
})

export const sendFriendRequest = createAsyncThunk('contact/follow', async (payload, thunkAPI) => {
    console.log("insdie the sendFriendRequest function", payload);

    try {
        const res = await axiosInstance.post(`/contact/send-request`, payload);

        if (res.data.success) {
            thunkAPI.dispatch(updateUserContactStatus({
                userId: payload.receiver,
                status: 'pending'
            }))
        }

        return res.data

    } catch (error) {
        console.log("error in sendFriendRequest function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "sendFriendRequest failed")

    }
})

export const updateFriendRequest = createAsyncThunk('contact/update', async (payload, thunkAPI) => {
    console.log("insdie the updateFriendRequest function", payload);

    try {
        const res = await axiosInstance.put(`/contact/update/request`, payload);

        if (res.data.success) {
            thunkAPI.dispatch(updateUserContactStatus({
                userId: payload.receiver,
                status: 'friend'
            }))
        }

        return res.data

    } catch (error) {
        console.log("error in updateFriendRequest function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "updateFriendRequest failed")

    }
})

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        resetStatusAndErrors: (state, action) => {
            state.friendRequestError = null,
                state.friendRequestStatus = 'idle'
            state.updateFriendRequestStatus = 'idle'
            state.updateUserContactError = null;
            state.contactListError = null;
            state.contactListStatus = 'idle';
            state.myFriendFetchStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendFriendRequest.pending, (state) => {
                state.friendRequestStatus = 'loading'
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                console.log("after sendFriendRequest api call success::", action.payload)
                state.friendRequestStatus = 'success';


            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                console.log("sendFriendRequest failed error::", action.error)
                state.friendRequestStatus = 'failed';
                state.friendRequestError = action.error.message

            })
            .addCase(updateFriendRequest.pending, (state) => {
                state.updateFriendRequestStatus = 'loading'
            })
            .addCase(updateFriendRequest.fulfilled, (state, action) => {
                console.log("after updateFriendRequest api call success::", action.payload)
                state.updateFriendRequestStatus = 'success';
                state.contactList = state.contactList.filter(contact => action.payload?.data?.contactRequestExist?._id.toString() !== contact._id.toString())


            })
            .addCase(updateFriendRequest.rejected, (state, action) => {
                console.log("updateFriendRequest failed error::", action.error)
                state.updateFriendRequestStatus = 'failed';
                state.updateUserContactError = action.error.message

            })
            .addCase(friendRequestList.pending, (state) => {
                state.contactListStatus = 'loading'
            })
            .addCase(friendRequestList.fulfilled, (state, action) => {
                console.log("after friendRequestList api call success::", action.payload)
                state.contactListStatus = 'success';
                state.contactList = action.payload.data.contactRequests;
                const { page, totalPages, total } = action.payload.data;
                state.pagination = {
                    ...state.pagination,
                    currentPage: page,
                    totalPages,
                    totalRecords: total
                }


            })
            .addCase(friendRequestList.rejected, (state, action) => {
                console.log("friendRequestList failed error::", action.error)
                state.contactListStatus = 'failed';
                state.contactListError = action.error.message

            })
            .addCase(myFriends.pending, (state) => {
                state.myFriendFetchStatus = 'loading'
            })
            .addCase(myFriends.fulfilled, (state, action) => {
                console.log("after myFriends api call success::", action.payload)
                state.myFriendFetchStatus = 'success';
                state.contactList = action.payload.data.contactRequests;
                const {friends, page, totalPages, total,limit } = action.payload.data;
                if (page === 1) {
                    state.myFriendList = friends;
                }
                else {
                    state.myFriendList = [...state.myFriendList, ...friends];
                }

                state.myFriendsPagination = {
                    ...state.myFriendsPagination,
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    limit
                }


            })
    }
})

export const { resetStatusAndErrors } = contactSlice.actions


export default contactSlice.reducer