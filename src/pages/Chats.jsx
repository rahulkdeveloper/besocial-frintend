import React, { useEffect, useState } from 'react'
import ChatSidebar from '../components/ChatSidebar'
import ChatWindow from '../components/ChatWindow'
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatrooms } from '../features/chat/ChatSlice';
import EditMessageModal from '../components/EditMessageModal';

const Chats = () => {


    const dispatch = useDispatch();

    const { allChatrooms, isChatStart, chatroomId,chatType } = useSelector(state => state.chatroom);

    useEffect(() => {
        
        dispatch(fetchChatrooms({ search: "" }))
    }, [])

    return (
        <div className="d-flex vh-100">
            <ChatSidebar allChatrooms={allChatrooms || []} />
            {isChatStart ? <ChatWindow
            roomId={chatroomId}
            key={chatroomId}
            chatType={chatType}
            />
                : <div className='d-flex align-items-center mx-auto'>
                    <h3>Besocial website</h3>
                </div>
            }
            <EditMessageModal/>

        </div>
    )
}

export default Chats