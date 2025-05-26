import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendFriendRequest,updateFriendRequest } from '../features/user/ContactSlice';
import { setShowAlert } from "../features/alert/AlertSlice";
import {apiUrl} from '../config/config'

const ProfileCard = (props) => {

    const { _id:userId, profileImage, fullName, username, bio, contactStatus = 'unknown',userContacts } = props.user;

    const dispatch = useDispatch();
    const { friendRequestStatus, friendRequestError,updateFriendRequestStatus,updateUserContactError } = useSelector(state => state.contact)

    const handleFollowRequest = (status) => {

        if (contactStatus === "unknown") {
            console.log("start following...");
            dispatch(sendFriendRequest({ receiver: userId }))
        }

        if(contactStatus === "Received" && ['accepted','rejected'].includes(status)){
            console.log("user want to accept or reject friend request::");
            dispatch(updateFriendRequest({status,contactRequestId:userContacts._id,receiver: userId}))
        }
        

    }

    useEffect(() => {
    const alertsToShow = [
        {
            condition: friendRequestStatus === 'success',
            message: "Friend Request sent!",
            variant: 'success'
        },
        {
            condition: updateFriendRequestStatus === 'success',
            message: "Friend Request Accepted!",
            variant: 'success'
        },
        {
            condition: friendRequestStatus === 'failed' && friendRequestError,
            message: friendRequestError,
            variant: 'danger'
        },
        {
            condition: updateFriendRequestStatus === 'failed' && updateUserContactError,
            message: updateUserContactError,
            variant: 'danger'
        }
    ];

    alertsToShow.forEach(alert => {
        if (alert.condition) {
            dispatch(setShowAlert({
                alert: true,
                message: alert.message,
                variant: alert.variant,
                duration: 1000
            }));
        }
    });
}, [dispatch, friendRequestStatus, friendRequestError, updateFriendRequestStatus, updateUserContactError]);


    return (
        <div class="card text-center mx-auto shadow" style={{ "width": "10rem;", padding: "0.5rem" }}>
            <img
                src={profileImage ? profileImage : "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600"}
                className="rounded-circle mx-auto mt-2"
                alt="User"
                width="100"
                height="100"
                style={{ objectFit: 'cover' }}
            />
            <div class="card-body">
                <h6 class="card-title">{fullName}</h6>
                <p class="card-text" style={{ fontSize: "0.7rem" }}>{bio}</p>
                <p className="card-text text-muted" style={{ fontSize: '0.7rem' }}>
                    {username}
                </p>
                {contactStatus === 'friend' && <Link href="#" class="btn btn-sm btn-success">Chat</Link>}
                {contactStatus === 'friend' && <Link href="#" class="btn btn-sm btn-danger mx-3 py-1 px-1"
                >Unfollow
                </Link>}
                {contactStatus === 'Received' && <>
                    <button class="btn btn-sm btn-success mx-3"
                    onClick={()=> handleFollowRequest('accepted')}
                    >Accept
                    </button>
                    <button class="btn btn-sm btn-danger mx-3"
                    onClick={()=> handleFollowRequest('rejected')}
                    >Reject
                    </button>
                </>}
               
                {['pending','unknown'].includes(contactStatus) && <div class="d-grid gap-2">
                    {contactStatus==='unknown'?<button class="btn btn-sm btn-primary" type="button"
                        onClick={handleFollowRequest}
                    >{'Follow'}</button>:<button class="btn btn-sm btn-primary" type="button"
                        disabled
                    >{'Request Sent'}</button>}
                </div>}

            </div>
        </div>
    )
}

export default ProfileCard