import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../features/user/UserSlice";
import { formatDate } from "../helper/utils";
import { setShowAlert } from "../features/alert/AlertSlice";
import useImageUpload from "../hooks/useImageUpload";

const Profile = () => {
  const [user, setUser] = useState({});
  const [formdata, setFormData] = useState({});
  const dispatch = useDispatch();
  const { preview, uploadedId, handleImageChange } = useImageUpload();

  const { userProfile, updateProfileStatus } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(JSON.parse(userData));
  }, []);

  // useEffect(() => {
  //   if (user?._id) {
  //     // fetch profile data
  //     dispatch(fetchProfile());
  //   }
  // }, [user?._id]);

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    let updatedFields = {};
    if(uploadedId){
      updatedFields.profileImage = uploadedId;
    }

    Object.keys(formdata).forEach((key) => {
      if (formdata[key] !== userProfile[key]) {
        updatedFields[key] = formdata[key];
      }
    });

    console.log("updatedFields===>", updatedFields);

    if (Object.keys(updatedFields).length > 0) {
      dispatch(updateProfile(updatedFields));
    } else {
      console.log("No field updated");
    }
  };

  useEffect(() => {
    if (updateProfileStatus === "success") {
      dispatch(
        setShowAlert({
          alert: true,
          message: "Updated!",
          variant: "success",
          duration: 1000,
        }),
      );
    }
  }, [dispatch, updateProfileStatus]);

  return (
    <div className="">
      <div className="container mt-3 py-5">
        {formdata ? (
          <form class="row g-3">
            <div class="col-md-6">
              <label for="inputFullName" class="form-label">
                Fullname
              </label>
              <input
                type="text"
                class="form-control"
                id="inputFullName"
                value={formdata.fullName}
                onChange={(e) =>
                  setFormData({ ...formdata, fullName: e.target.value })
                }
              />
            </div>
            <div class="col-md-6">
              <label for="inputEmail4" class="form-label">
                Email
              </label>
              <input
                type="email"
                class="form-control"
                id="inputEmail4"
                value={formdata.email}
                disabled
              />
            </div>

            <div class="col-md-6">
              <label for="inputUsername" class="form-label">
                username
              </label>
              <input
                type="text"
                class="form-control"
                id="inputUsername"
                value={formdata.username}
                disabled
              />
            </div>
            <div class="col-md-6">
              <label for="inputDOB" class="form-label">
                Date of birth
              </label>
              <input
                type="Date"
                class="form-control"
                id="inputDOB"
                value={formatDate(formdata.dateOfBirth)}
                onChange={(e) =>
                  setFormData({
                    ...formdata,
                    dateOfBirth: e.target.value,
                  })
                }
              />
            </div>
            <div class="col-12">
              <label for="inputProfileImage" class="form-label">
                profileImage
              </label>
              <input
                type="file"
                class="form-control"
                id="inputProfileImage"
                onChange={handleImageChange}
              />

              {(preview || formdata?.profileImage?.url) && (
                <div>
                  <img
                    src={preview || formdata?.profileImage?.url}
                    alt="banner"
                    style={{ width: "150px", height: "150px" }}
                    className="rounded-circle mx-auto mt-2"
                  />
                  <p className="mt-2 text-muted">Click above to change image</p>
                </div>
              )}
            </div>
            <div class="col-md-6">
              <label for="inputPhone" class="form-label">
                Phone
              </label>
              <input
                type="text"
                class="form-control"
                id="inputPhone"
                value={formdata.phone}
                onChange={(e) =>
                  setFormData({ ...formdata, phone: e.target.value })
                }
              />
            </div>
            <div class="col-md-4">
              <label for="inputGender" class="form-label">
                Gender
              </label>
              <select
                id="inputGender"
                class="form-select"
                value={formdata.gender}
                onChange={(e) =>
                  setFormData({ ...formdata, gender: e.target.value })
                }
              >
                <option selected>Choose...</option>
                <option>male</option>
                <option>female</option>
                <option>other</option>
              </select>
            </div>
            <div class="col-md-2">
              <label for="inputZip" class="form-label">
                Bio
              </label>
              <input
                type="text"
                class="form-control"
                id="inputZip"
                value={formdata.bio}
                onChange={(e) =>
                  setFormData({ ...formdata, bio: e.target.value })
                }
              />
            </div>
            {/* <div class="col-12">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="gridCheck" />
            <label class="form-check-label" for="gridCheck">
              Check me out
            </label>
          </div>
        </div> */}
            <div class="col-12">
              <button
                type="submit"
                class="btn btn-primary"
                onClick={handleUpdateProfile}
              >
                Update
              </button>
            </div>
          </form>
        ) : (
          "Not Found"
        )}
      </div>
    </div>
  );
};

export default Profile;
