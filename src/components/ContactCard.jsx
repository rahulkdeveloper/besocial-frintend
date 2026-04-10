import React from 'react';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { startChat } from '../features/chat/ChatSlice';
import { useNavigate } from 'react-router-dom';

const ContactCard = ({ contactDetail, updateStatus, type }) => {

    const { _id, sender: { _id: userId, fullName, bio, profilImage },chatroomId } = contactDetail;
    const dispatch = useDispatch();
    const navigate  = useNavigate()

    const handleStartChat = async () => {
        if (!chatroomId) return;
    
        dispatch(startChat({ id: chatroomId, type: "single" }));
        navigate("/chats");
      };

    return (
        <Card className="p-3 shadow-sm profile-card">
            <Row className="align-items-center">
                {/* Left side: Text and Button */}
                <Col md={4} className="text-center">
                    <Image
                        src={profilImage ? profilImage : "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600"}
                        // roundedCircle
                        fluid
                        alt="Profile"
                        // height={90}
                        // width={100}
                    />
                </Col>


                {/* Right side: Rounded Image */}
                <Col md={8}>
                    <Card.Body>
                        <Card.Title className="fs-6 mb-1">{fullName}</Card.Title>
                        <Card.Text style={{ fontSize: '0.85rem' }}>
                            {bio}
                        </Card.Text>
                        {type === 'friends' && <Button size="sm" variant="success" className="me-1" onClick={handleStartChat}
                        >Chat</Button>}
                        {type === 'friends' && <Button size="sm" variant="danger" className="me-1"
                        >Unfollow</Button>}

                        {type !== 'friends' && <Button size="sm" variant="success" className="me-1"
                            onClick={() => updateStatus("accepted", userId, _id)}
                        >Accept</Button>}

                        {type !== 'friends' && <Button size="sm" variant="danger"
                            onClick={() => updateStatus("rejected", userId, _id)}
                        >Reject</Button>}


                    </Card.Body>
                </Col>
            </Row>
        </Card>
    )
}

export default ContactCard