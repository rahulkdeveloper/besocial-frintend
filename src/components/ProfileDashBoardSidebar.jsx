import React from 'react'

const ProfileDashBoardSidebar = () => {
    const users = [
        { id: 1, name: 'Brijesh', message: 'Image', time: '15:55' },
        { id: 2, name: 'Wifyyyy', message: 'Golu Bhaiya', time: '13:26' },
        { id: 3, name: 'Rahul 2', message: 'Ok', time: 'Yesterday' },
        // Add more users here
    ];

    return (
        <div className="chat-sidebar bg-light border-end p-2">
            <h5 className="ps-2">Chats</h5>
            <div className="chat-list">
                {users.map((user) => (
                    <div key={user.id} className="chat-user d-flex justify-content-between align-items-center p-2 border-bottom">
                        <div>
                            <strong>{user.name}</strong>
                            <div className="text-muted small">{user.message}</div>
                        </div>
                        <div className="text-muted small">{user.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProfileDashBoardSidebar