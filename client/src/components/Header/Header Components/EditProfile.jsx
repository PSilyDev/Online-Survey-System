import { useContext, useState } from "react";
import { LoginContext } from "../../../Context/LoginContext";
import axios from "axios";
import EditProfileCSS from "./EditProfileStyling.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile() {
  //fetching data from Context that, the states are stored in App.js
  //userData stores the current user that is Logged In
  const { userData, setUserData, setShowEditButton } = useContext(LoginContext);

  //error state for error in posting data to the json-server and also for validatio
  const [editData, setEditData] = useState(userData);

  const [errors, setErrors] = useState();

  //initially showEdiTButton set to false, user in on the Edit page only
  setShowEditButton(false);

  function handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;

    setEditData({ ...editData, [name]: value });

    setErrors("");
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    // validate if username is enetered
    if (!editData.username || editData.username.trim() === "") {
      setErrors("Username is required!");
    }

    // validate if first_name is empty
    else if (!editData.first_name || editData.first_name.trim() === "") {
      setErrors("First name is required!");
    }
    //validate if email is enetered or not?
    else if (!editData.email || editData.email.trim() === "") {
      setErrors("Email is required");
    } else {
      try {
        //user has enetered username and email, first_name

        //check if username already exists
        let dupUser = await axios.get(
          `http://localhost:4000/user-api/users/${editData.username}`
        );

        if (
          dupUser.data.message === "User found" &&
          editData.username !== userData.username
        ) {
          setErrors("Username already exists!");
        } else {
          //updating state
          const updatedUserData = {
            ...userData,
            username: editData.username,
            email: editData.email,
            first_name: editData.first_name,
            last_name: editData.last_name,
          };

          let res = await axios.put(
            "http://localhost:4000/user-api/users",
            updatedUserData
          );
          console.log("res - ", res);
          if (res.data.message === "User modified") {
            setUserData(updatedUserData);
            console.log("updated user data - ", updatedUserData);
            setShowEditButton(true);
            toast.success("updated successfully!", {
              autoClose: 2000,
            });
          } else {
            setErrors(res.data.message);
          }
        }
      } catch (error) {
        setErrors("Error updating user data");
      }
    }
  }

  return (
    <>
      <div className={EditProfileCSS.editForm}>
        <form onSubmit={handleFormSubmit}>
          <h2>Edit Profile</h2>

          <div className={`form-group ${EditProfileCSS.formGroup}`}>
            <label className={EditProfileCSS.formLabel} htmlFor="id">
              ID
            </label>
            <input
              type="text"
              className={`form-control ${EditProfileCSS.formControl}`}
              value={userData.id}
            />
          </div>
          <div className={`form-group ${EditProfileCSS.formGroup}`}>
            <label className={EditProfileCSS.formLabel} htmlFor="username">
              Username
            </label>
            <input
              type="text"
              className={`form-control ${EditProfileCSS.formControl}`}
              name="username"
              defaultValue={userData.username}
              onChange={handleChange}
            />
          </div>
          <div className={`form-group ${EditProfileCSS.formGroup}`}>
            <label className={EditProfileCSS.formLabel} htmlFor="first_name">
              First name
            </label>
            <input
              type="text"
              className={`form-control ${EditProfileCSS.formControl}`}
              name="first_name"
              defaultValue={userData.first_name}
              onChange={handleChange}
            />
          </div>
          {userData?.last_name.trim() !== "" && (
            <div className={`form-group ${EditProfileCSS.formGroup}`}>
              <label className={EditProfileCSS.formLabel} htmlFor="last_name">
                Last name
              </label>
              <input
                type="text"
                className={`form-control ${EditProfileCSS.formControl}`}
                name="last_name"
                defaultValue={userData.last_name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className={`form-group ${EditProfileCSS.formGroup}`}>
            <label className={EditProfileCSS.formLabel} htmlFor="email">
              Email
            </label>
            <input
              type="text"
              className={`form-control ${EditProfileCSS.formControl}`}
              name="email"
              defaultValue={userData.email}
              onChange={handleChange}
            />
          </div>
          {errors?.length !== 0 && (
            <p className="fs-6 text-center text-danger">{errors}</p>
          )}
          <div className={`form-group ${EditProfileCSS.formGroup}`}>
            <button
              type="submit"
              className="btn btn-success btn-md btn-block px-4"
            >
              Edit
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}
