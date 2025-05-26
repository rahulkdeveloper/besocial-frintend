import React from 'react';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';

const ContactCard = ({ contactDetail, updateStatus, type }) => {

    const { _id, sender: { _id: userId, fullName, bio, profilImage } } = contactDetail;

    return (
        <Card className="p-3 shadow-sm">
            <Row className="align-items-center">
                {/* Left side: Text and Button */}
                <Col md={4} className="text-center">
                    <Image
                        src={profilImage?.url ? profilImage.url : "https://res.cloudinary.com/dlfuxeq5r/image/upload/v1747045816/uploads/rvlyjfnzrsmukzcs888a.jpg"}
                        // roundedCircle
                        fluid
                        alt="Profile"
                    />
                </Col>


                {/* Right side: Rounded Image */}
                <Col md={8}>
                    <Card.Body>
                        <Card.Title className="fs-6 mb-1">{fullName}</Card.Title>
                        <Card.Text style={{ fontSize: '0.85rem' }}>
                            {bio}
                        </Card.Text>
                        {type === 'friends' && <Button size="sm" variant="success" className="me-1"
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