import React, { use, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { Form, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { signup, resetStatusAndErrors } from "../features/auth/AuthSlice";
import { setShowAlert } from "../features/alert/AlertSlice"

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [bio, setBio] = useState("")

    const naviagte = useNavigate()

    const dispatch = useDispatch();
    const { signupStatus, signupError, token } = useSelector(state => state.auth) // get state from store

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const signupData = {
            email,
            username,
            fullName: name,
            password,
            dateOfBirth,
            gender,
        }

        dispatch(signup(signupData));

    }

    useEffect(() => {

        if (signupStatus === 'success' && (token || localStorage.getItem("token"))) {
            dispatch(setShowAlert({ alert: true, message: "Signup successfully", variant: 'success', duration: 2000 }));
            setTimeout(() => {

                naviagte("/onBoard")
            }, 2000);

        }
        return () => {
            dispatch(resetStatusAndErrors())
        }

    }, [dispatch, token, naviagte])

    useEffect(() => {
        if (signupStatus === "failed" && signupError) {

            dispatch(setShowAlert({ alert: true, message: signupError, variant: 'danger' }));
        }
    }, [dispatch, signupStatus, signupError])

    return (
        <div className='container m-2'>
            <div className='row'>
                <div className='col d-flex justify-content-center align-items-center'>
                    <img
                        src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg'
                        height={"300"}
                        alt='login image'
                    />
                </div>
                <div className='col mt-3'>
                    {/* <div className='w-100' style={{ maxWidth: "450px" }}> */}

                    <h1 className='text-center'>Signup here</h1>
                    <form onSubmit={onSubmitHandler}>
                        <div className="mb-3">
                            <label for="formGroupExampleInput2" class="form-label">FullName</label>
                            <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="" name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label for="formGroupExampleUsername" class="form-label">username</label>
                            <input type="text" class="form-control" id="formGroupExampleUsername" placeholder="" name='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        {/* <div className="mb-3">
                            <label for="formGroupExampleBio" class="form-label">bio</label>
                            <input type="text" class="form-control" id="formGroupExampleBio" placeholder="" name='username'
                                value={bio}
                                onChange={(e) =>setBio(e.target.value)}
                            />
                        </div> */}
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">

                            <label for="exampleInputEmail1" className="form-label">Gender</label>
                            <select class="form-select" aria-label="Default select example"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option>Select gender</option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                                <option value="other">other</option>
                            </select>

                        </div>
                        <div className="mb-3">
                            <Form.Group controlId="birthday">
                                <Form.Label className="">Date of Birth</Form.Label>
                                <Form.Control type="date" name="dateOfBirth" className="shadow-sm"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                />
                            </Form.Group>
                        </div>

                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" type="button"
                                onClick={onSubmitHandler}
                            >
                                {signupStatus==='loading'?'loading...':'signup'}
                            </button>
                        </div>
                    </form>

                    <div className='lower mt-3 d-flex text-align'>
                        <p>Existing user ? </p>
                        <Link className='mx-3' style={{ "textDecoration": "none" }} to={"/login"}>Login</Link>
                    </div>
                    {/* {signUpError && <p style={{ color: "red" }}>{signUpError}</p>} */}
                    {/* </div> */}
                </div>
            </div>
        </div>
    )
}

export default Signup