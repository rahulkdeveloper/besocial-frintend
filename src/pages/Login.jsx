import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { resetStatusAndErrors, login } from "../features/auth/AuthSlice"
import { setShowAlert } from "../features/alert/AlertSlice"

const Login = () => {

    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");

    const naviagte = useNavigate()

    const dispatch = useDispatch();
    const { loginStatus, loginError, token } = useSelector(state => state.auth)

    const onSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(login({ emailOrPhone, password }));

    }


    useEffect(() => {

        if (loginStatus === "success" && (token || localStorage.getItem("token"))) {
            dispatch(setShowAlert({ alert: true, message: "Login successfull", variant: 'success', duration: 1000 }));
            setTimeout(() => {

                naviagte("/users")
            }, 1500);

        }
        return () => {
            dispatch(resetStatusAndErrors())
        }

    }, [dispatch, loginStatus, token, naviagte])

    useEffect(() => {
        if (loginStatus === "failed" && loginError) {
            dispatch(setShowAlert({ alert: true, message: loginError, variant: 'danger', duration: 1500 }));
        }
    }, [dispatch, loginStatus, loginError])



    return (
        <div className='container' style={{ "maxWidth": "500px" }}>

            {/* <FileUploadModal/> */}

            <div className='logo text-center'>
                {/* <img
                    src='https://admin.jolfest.com/assets/images/logo-main.png'
                /> */}
                <h1>ConnectBuddy</h1>
            </div>

            <div className='border border-2 rounded p-5 mt-5'>
                <h3 className='text-center'>Login Here</h3>
                <form onSubmit={onSubmitHandler}>
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Email or Phone</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='emailOrPhone' value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                        />

                    </div>
                    <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" name='password' value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>


                    <div class="d-grid">
                        <button type="submit" disabled={loginStatus === "loading"} className="btn btn-primary">Login</button>
                    </div>
                </form>
                <div className='lower mt-3 d-flex text-align'>
                    <p>Not a user ? </p>
                    <Link className='mx-3' style={{ "textDecoration": "none" }} to={"/signup"}>Signup</Link>
                </div>
            </div>
        </div>
    )
}

export default Login