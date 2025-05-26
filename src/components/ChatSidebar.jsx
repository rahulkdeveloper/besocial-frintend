import React, { useEffect } from 'react';
import { Image, Badge } from 'react-bootstrap';
import { getDateAndTime } from "../helper/utils";
import { constant } from '../config/config';
import { FaImage } from 'react-icons/fa';
import { startChat } from '../features/chat/ChatSlice'
import { useDispatch, useSelector } from 'react-redux';
import { unReadIncomingMessage } from '../features/chat/ChatSlice';
import socket from '../socket';

const ChatSidebar = ({ allChatrooms }) => {

    const dispatch = useDispatch()

    const chatStart = (roomId, type) => {
        dispatch(startChat({ id: roomId, type }))
    }

    const { singleChatroomDetail } = useSelector(state => state.chatroom);

    useEffect(() => {
        const handler = (data) => {
            console.log("unread message received for sidebar::", data);
            console.log("singleChatroomDetail detail", singleChatroomDetail);

            if(singleChatroomDetail && data.room.toString() === singleChatroomDetail._id.toString()){
                dispatch(unReadIncomingMessage({ message: data.data,type:"read" }))
            }
            
            else {
                dispatch(unReadIncomingMessage({ message: data.data,type:"unread" }))
            }
        };

        socket.on('message_received', handler);

        return () => {
            socket.off('message_received', handler); // clean up listener
        };
    }, [singleChatroomDetail]);

    return (
        <div className="chat-sidebar bg-light border-end p-2">
            <h5 className="ps-2">Chats</h5>
            <input className="form-control my-2" placeholder="Search or start new chat" />
            <div className="chat-list">
                {allChatrooms.map((room) => (
                    <div key={room._id} className="chat-user d-flex justify-content-between align-items-center p-2 border-bottom"
                        onClick={() => chatStart(room._id, room.chatType)}
                    >
                        <div className='d-flex align-items-center'>
                            <div>
                                <Image
                                    src={room.friend?.profileImage?.url || constant.userIcon}
                                    roundedCircle
                                    height={40}
                                    width={40}
                                    alt="Profile"
                                />
                            </div>
                            <div className='mx-2 flex-grow-1'>
                                {room.chatType === 'single' && <strong>{room.friend?.fullName || room.friend?.username}</strong>}
                                {room.chatType === 'group' && <strong>{room.name}</strong>}


                                <div className="text-muted small">
                                    {room.currentMessage?.type === 'text' && room.currentMessage?.content
                                        ? room.currentMessage.content
                                        : room.currentMessage?.type
                                            ? <><FaImage className="mx-1" />Image</>
                                            : ""}
                                </div>
                            </div>
                        </div>
                        <div className="text-muted small text-nowrap ms-2">{room.currentMessage?.createdAt && getDateAndTime(room.currentMessage.createdAt)}
                            {room.unreadMessageCount > 0 && <Badge className='mx-1'>{room.unreadMessageCount}</Badge>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatSidebar