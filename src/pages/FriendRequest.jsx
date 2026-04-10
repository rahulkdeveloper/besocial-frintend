import React, { useEffect } from 'react'
import ContactCard from '../components/ContactCard';
import { friendRequestList, resetStatusAndErrors, updateFriendRequest } from '../features/user/ContactSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setShowAlert } from "../features/alert/AlertSlice";

function FriendRequest() {

    const dispatch = useDispatch()

    const { contactListStatus, contactList, contactListError, pagination, updateFriendRequestStatus, updateUserContactError } = useSelector(state => state.contact);

    useEffect(() => {

        dispatch(friendRequestList({ page: pagination.currentPage, limit: pagination.limit }))

        return () => {
            dispatch(resetStatusAndErrors())
        }
    }, [])


    const updateStatus = (status, userId, contactRequestId) => {
        dispatch(updateFriendRequest({ status, contactRequestId: contactRequestId, receiver: userId }))
    }

    useEffect(() => {

        if (updateFriendRequestStatus === 'success') {
            dispatch(setShowAlert({
                alert: true,
                message: "Updated!",
                variant: "success",
                duration: 1000
            }));
        }

        if(updateFriendRequestStatus==='failed' && updateUserContactError){
            dispatch(setShowAlert({
                alert: true,
                message: updateUserContactError,
                variant: "danger",
                duration: 1000
            }));
        }

    }, dispatch, updateFriendRequestStatus, updateUserContactError)


    return (
        <div className='row mt-5 text-center'>
            <h3>Friend Request:</h3>
            {contactList && contactList.length > 0 && contactList.map(request => (
                <div className='col-md-3 mb-3'>
                    <ContactCard
                        key={request._id}
                        contactDetail={request}
                        updateStatus={updateStatus}
                    />
                </div>
            ))}


        </div>
    )
}

export default FriendRequest