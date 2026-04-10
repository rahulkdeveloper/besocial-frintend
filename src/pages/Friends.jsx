import React, { useEffect } from 'react';
import ContactCard from '../components/contactCard';
import { useDispatch, useSelector } from 'react-redux';
import { myFriends, resetStatusAndErrors, updateFriendRequest } from '../features/user/ContactSlice';
import { Form, Button, InputGroup, Container, FormControl } from 'react-bootstrap';

const Friends = () => {

    const dispatch = useDispatch()

    const { myFriendList, myFriendsPagination } = useSelector(state => state.contact);

    useEffect(() => {

        dispatch(myFriends({ page: myFriendsPagination.currentPage, limit: myFriendsPagination.limit }))

        return () => {
            dispatch(resetStatusAndErrors())
        }
    }, [])

    const handleLoadMore = () => {
        dispatch(myFriends({ page: myFriendsPagination.currentPage + 1, limit: myFriendsPagination.limit }))
    }

    const handleSearch = (e) => {
        const search = e.target.value;
        dispatch(myFriends({ page: 1, limit: myFriendsPagination.limit, search }))
      }

    return (
        <>
            <Container className="my-3">
                <Form className="mx-auto d-flex">
                    <FormControl
                        type="search"
                        placeholder="Search..."
                        className="me-2"
                        aria-label="Search"
                        name='search'
                        onChange={handleSearch}
                    />
                    <Button variant="outline-primary">Search</Button>
                </Form>
            </Container>
            <div className='row mt-5 text-center'>
                <h3>Friends:</h3>
                {myFriendList && myFriendList.length > 0 && myFriendList.map(friend => (
                    <div className='col-md-3 mb-3'>
                        <ContactCard
                            key={friend._id}
                            type='friends'
                            contactDetail={
                                {
                                    _id: friend._id,
                                    sender: {
                                        _id: friend.friend?._id, fullName: friend.friend?.fullName, bio: friend.friend?.bio, profilImage: friend.friend?.profileImage?.url
                                    },
                                    chatroomId:friend.chatroomId
                                }
                            }
                        // updateStatus={updateStatus}
                        />
                    </div>
                ))}

                {myFriendsPagination.currentPage < myFriendsPagination.totalPages && <div className='mx-auto text-center' style={{}}>
                    <Button variant='success' className='my-3' size='sm'
                        onClick={handleLoadMore}
                    >Load More</Button>
                </div>}

            </div>
        </>
    )
}

export default Friends