import React, { useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  NavDropdown,
  Image,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/AuthSlice";
import { constant } from "../config/config";
import { FaBell } from "react-icons/fa";
import { fetchProfile } from "../features/user/UserSlice";

const MyNavbar = () => {
  const notificationCount = 3;

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const { userProfile } = useSelector(
      (state) => state.user,
    );

  useEffect(() => {
    if (user?._id) {
      // fetch profile data
      dispatch(fetchProfile());
    }
  }, [user?._id]);

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm py-2">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand as={Link} to={"/"}>
          {/* <img
                        src="https://admin.jolfest.com/assets/images/logo-main.png" // Replace with your logo
                        alt="Logo"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '} */}
          ConnectBuddy
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-content" />

        <Navbar.Collapse id="navbar-content">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={"/chats"}>
              {" "}
              Chats
            </Nav.Link>
            <Nav.Link as={Link} to={"/users"}>
              {" "}
              Users
            </Nav.Link>
            <NavDropdown title={<span>Friends</span>}>
              <NavDropdown.Item as={Link} to={"/friends"}>
                All Friends
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/friend-requets"}>
                Friend requests
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Centered Search Bar */}
          {/* <Form className="mx-auto w-50 d-flex">
                        <FormControl
                            type="search"
                            placeholder="Search..."
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-primary">Search</Button>
                    </Form> */}

          {/* Notifications */}
          {/* <Nav className="ms-auto"> */}
          {/* <NavDropdown
                            title={
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <FaBell size={20} />
                                    {notificationCount > 0 &&
                                        <Badge
                                            style={{
                                                position: 'absolute',
                                                // top: '-8px',
                                                // right: '-10px',
                                                fontSize: '0.6rem',
                                            }}
                                        >
                                            {notificationCount}
                                        </Badge>
                                    }
                                </div>
                            }
                            id="user-nav-dropdown"
                            align="end"
                        > */}
          {/* Notification Items */}
          {/* <NavDropdown.Item href="#n1">New friend request</NavDropdown.Item>
                            <NavDropdown.Item href="#n2">Message from John</NavDropdown.Item>
                            <NavDropdown.Item href="#n3">Profile viewed</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#all">View all notifications</NavDropdown.Item> */}
          {/* </NavDropdown> */}
          {/* </Nav> */}

          {/* Right - User Info Dropdown */}
          <Nav className="ms-auto">
            <NavDropdown
              title={
                <span>
                  <Image
                    src={userProfile?.profileImage?.url || constant.userIcon}
                    roundedCircle
                    height="30"
                    className="me-2"
                  />
                  {user?.fullName || "user"}
                </span>
              }
              id="user-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
4;

export default MyNavbar;
