import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from '../../api/axiosInstance';

const initialState = {
    users: [],
    updateProfileStatus: 'idle',
    updateProfileError: null,
    userListStatus: 'idle',
    userListError: 'idle',
    fetchProfileStatus:'idle',
    fetchProfileError:null,
    userProfile:null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        limit: 12,
        totalItems: 0
    }
}

export const updateProfile = createAsyncThunk('user/update', async (payload, thunkAPI) => {

    try {
        const res = await axiosInstance.put(`/user/profile/update`, payload);
        return res.data

    } catch (error) {
        console.log("error in updateProfile function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "updateProfile failed")

    }
})

export const userList = createAsyncThunk('user/list', async (payload, thunkAPI) => {
    const { limit = 10, page = 1, search = '' } = payload;

    try {

        let url = `/user/list?page=${page}&limit=${limit}&search=${search || ''}`;

        const res = await axiosInstance.get(url);
        return res.data

    } catch (error) {
        console.log("error in login function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "userList failed")

    }
})

export const fetchProfile = createAsyncThunk('user/profile', async (payload, thunkAPI) => {
    try {

        let url = `/user/profile`;

        const res = await axiosInstance.get(url);
        return res.data

    } catch (error) {
        console.log("error in fetchProfile function", error);
        throw new Error(error.response.data.message || error.response.data.errors || "userList failed")

    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetStatusAndErrors: (state, action) => {
            state.updateProfileError = null,
                state.updateProfileStatus = 'idle'
        },
        updateUserContactStatus: (state, action) => {
            const { userId, status } = action.payload;
            const user = state.users.find(u => u._id === userId);
            if (user) {
                user.contactStatus = status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.updateProfileStatus = 'loading'
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateProfileStatus = 'success';

            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateProfileStatus = 'failed';
                state.updateProfileError = action.error.message

            })
            .addCase(userList.pending, (state) => {
                state.userListStatus = 'loading'
            })
            .addCase(userList.fulfilled, (state, action) => {
                state.userListStatus = 'success';
                const {users, page, totalPages, total,limit } = action.payload.data;
                
                if(page===1){
                    state.users = action.payload.data.users;
                }
                else{
                    state.users = [...state.users, ...users];
                }

                state.pagination = {
                    ...state.pagination,
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    limit
                }

            })
            .addCase(userList.rejected, (state, action) => {
                state.userListStatus = 'failed';
                state.userListError = action.error.message

            })
            .addCase(fetchProfile.pending, (state) => {
                state.fetchProfileStatus = 'loading'
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.fetchProfileStatus = 'success';                
                state.userProfile = action.payload.data

            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.fetchProfileStatus = 'failed';
                state.fetchProfileError = action.error.message

            })
    }

})

export const { resetStatusAndErrors,updateUserContactStatus } = userSlice.actions


export default userSlice.reducer