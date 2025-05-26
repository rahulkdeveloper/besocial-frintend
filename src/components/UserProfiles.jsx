import React, { useEffect } from 'react'
import ProfileCard from './ProfileCard'
import { useDispatch, useSelector } from 'react-redux';
import { resetStatusAndErrors, userList } from '../features/user/UserSlice';
import { Form, Button, InputGroup, Container, FormControl } from 'react-bootstrap';

const UserProfiles = () => {

  const dispatch = useDispatch();
  const { users, userListStatus, userListError, pagination } = useSelector(state => state.user);

  useEffect(() => {

    dispatch(userList({ page: pagination.currentPage, limit: pagination.limit }))

    return () => {
      dispatch(resetStatusAndErrors())
    }
  }, [])

  const handleSearch = (e) => {
    const search = e.target.value;
    dispatch(userList({ page: 1, limit: pagination.limit, search }))
  }

  const handleLoadMore = () => {
    dispatch(userList({ page: pagination.currentPage+1, limit: pagination.limit}))
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
      <div className='row mt-3'>
        {(!users || users.length === 0) &&
          <div className='d-flex justify-content-center align-items-center'>
            <h3>User not found.</h3>
          </div>

        }
        {users && users.length > 0 && users.map(user => (
          <div className='col-md-3 mb-2'>
            <ProfileCard
              key={user._id}
              // userId={user._id}
              // profileImage={user.profileImage}
              // fullName={user.fullName}
              // username={user.username}
              // bio={user.bio}
              // contactStatus={user.contactStatus}
              user={user}
            />
          </div>
        ))}

      </div>
      {pagination.currentPage <pagination.totalPages && <div className='mx-auto text-center' style={{}}>
        <Button variant='success' className='my-3' size='sm'
          onClick={handleLoadMore}
        >Load More</Button>
      </div>}
    </>
  )
}

export default UserProfiles