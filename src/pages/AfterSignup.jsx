import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { updateProfile, resetStatusAndErrors } from '../features/user/UserSlice';
import { setShowAlert } from "../features/alert/AlertSlice"

const AfterSignup = () => {

    const [bio, setBio] = useState("");
    const [phone, setPhone] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [profileImagePreview, setProfileImagePreview] = useState("");
    const [user,setUser] = useState(null);

    const naviagte = useNavigate()

    const dispatch = useDispatch();
    const { updateProfileStatus, updateProfileError } = useSelector(state => state.user)

    useEffect(()=>{
        setUser(localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')):null);
    },[])

    if(user && user.isOnBoardCompleted){
        naviagte('/users')
    }

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImagePreview(reader.result)
        }
        reader.readAsDataURL(file)

        const formdata = new FormData();
        formdata.append('file', file);

        try {
            const res = await axiosInstance.post('/upload/single', formdata, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            setProfileImage(res.data.data._id)

        } catch (error) {
            console.log('error in upload profile image', error);

        }

    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        let profiledata = {
            isOnBoardCompleted: true,
            bio,
            phone,
            profileImage
        }

        dispatch(updateProfile(profiledata))
    }

    useEffect(() => {

        if (updateProfileStatus === 'success') {
            localStorage.setItem('user',JSON.stringify({...user,isOnBoardCompleted:true}))
            dispatch(setShowAlert({ alert: true, message: "Profile updated!", variant: 'success', duration: 1000 }));
            setTimeout(() => {

                naviagte("/")
            }, 1000);

        }
        return () => {
            dispatch(resetStatusAndErrors())
        }

    }, [dispatch, updateProfileStatus])

    useEffect(() => {
        if (updateProfileStatus === "failed" && updateProfileError) {
            dispatch(setShowAlert({ alert: true, message: updateProfileError || 'Some error occured. Try again', variant: 'danger' }));
        }
    }, [dispatch, updateProfileStatus, updateProfileError])

    return (
        <div className='m mt-5 mx-auto' style={{ maxWidth: "500px" }}>
            <h1 className='text-center'>OnBoard</h1>
            <form>
                <div className="mb-3">
                    <label class="" for="inputGroupFile01">Profile Image</label>
                    <input type="file" class="form-control mb-3" id="inputGroupFile01"
                        onChange={handleProfileImageChange}
                    />


                    {profileImagePreview &&
                        <div>
                            <img src={profileImagePreview}
                                alt='banner'
                                style={{ width: "150px", height: '150px' }}
                                className='rounded-circle mx-auto mt-2'
                            />
                            <p className="mt-2 text-muted">Click above to change image</p>
                        </div>
                    }
                </div>
                <div className="mb-3">
                    <label for="formGroupExampleInput2" class="form-label">Bio</label>
                    <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="" name='bio'
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label for="formGroupExamplePhone" class="form-label">Phone</label>
                    <input type="text" class="form-control" id="formGroupExamplePhone" placeholder="" name='phone'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" type="button"
                        onClick={onSubmitHandler}
                    >
                        Update Profile
                        {/* {signup === 'loading' ? 'loading...' : 'Update'} */}
                    </button>
                </div>
            </form>
            <div className='lower mt-3 d-flex text-align'>
                <p onClick={onSubmitHandler}>Skip</p>
            </div>
        </div>
    )
}

export default AfterSignup