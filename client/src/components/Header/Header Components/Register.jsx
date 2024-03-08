import axios from 'axios';
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RegisterCSS from './RegisterStyling.module.css';

export default function Register() {
    const navigate = useNavigate();

    //registrationData state used for storing the username, email, passwords of users
    const [registrationData, addRegistrationData] = useState({});

    //error state for error in posting data to the json-server and also for validation
    const [errors, setErrors] = useState("");


    function handleChange(event){
        let name = event.target.name;
        let value = event.target.value;

        addRegistrationData({...registrationData, [name]: value});

        setErrors("");
    }

    function handleConfirmPasswordChange(event){
        let name = event.target.name;
        let value = event.target.value;
        
        addRegistrationData({...registrationData, [name]: value});

        if(registrationData?.password !== value){
            setErrors("Password does not match!")
        }
        else{
            setErrors("Password matched!")
        }
    }

    async function handleFormSubmit(event){
        event.preventDefault();
        try{

            //validating first is entered or not?
            if(!registrationData.first_name || registrationData.first_name.trim() === '') {
                setErrors('Please enter name!')
            }


            //validating username is entered or not?
            else if(!registrationData.username || registrationData.username.trim() === '') {
                setErrors('Please enter username!')
            }

            //validating email is entered or not?
            else if(!registrationData.email || registrationData.email.trim() === '') {
                setErrors('Please enter email!')
            }

            //validating password is entered or not?
            else if(!registrationData.password || registrationData.password.trim() === '') {
                setErrors('Please enter valid password!')
            }

            else if(!registrationData.confirm_password || registrationData.confirm_password.trim() === ''){
                setErrors("Please confirm password!")
            }

            else if(registrationData.password !== registrationData.confirm_password){
                setErrors("Password does not match!")
            }

            else
            {
                const res = await axios.post('http://localhost:4000/user-api/users', registrationData);
                if(res.status === 201){
                    toast.success("Registration Successfull. Routing to Login", {autoClose: 2000});
                    setTimeout(() => {
                        navigate('/login')
                    }, 2500)
                }
                else{
                    setErrors(res.data.payload);
                }
                
            }
        }
        catch(err) {
            setErrors(err.message);
        }
    }

    return(
        <>
            <div className={RegisterCSS.signupForm}>
                <form onSubmit={handleFormSubmit}>
                    <h2>Register</h2>
                    <p className={RegisterCSS.hintText}>Create your account. It's free and only takes a minute</p>

                    <div className={`form-group ${RegisterCSS.formGroup}`}>
                        <div className={`row ${RegisterCSS.row}`}>
                    
                            <div className={`col ${RegisterCSS.col1}`}>
                                <input type="text" className={`form-control ${RegisterCSS.formControl}`} name="first_name" placeholder="First Name" onChange={handleChange} />
                            </div>
                    
                            <div className={`col ${RegisterCSS.col2}`}>
                                <input type="text" className={`form-control ${RegisterCSS.formControl}`} name="last_name" placeholder="Last Name" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div className={`form-group ${RegisterCSS.formGroup}`}>
                        <input type="text" className={`form-control ${RegisterCSS.formControl}`} name="username" placeholder="Username" onChange={handleChange} />
                    </div>
                    <div className={`form-group ${RegisterCSS.formGroup}`}>
                        <input type="email" className={`form-control ${RegisterCSS.formControl}`} name="email" placeholder="Email" onChange={handleChange} />
                    </div>
                    <div className={`form-group ${RegisterCSS.formGroup}`}>
                        <input type="password" className={`form-control ${RegisterCSS.formControl}`} name="password" placeholder="Password" onChange={handleChange} />
                    </div>
                    <div className={`form-group ${RegisterCSS.formGroup}`}>
                        <input type="password" className={`form-control ${RegisterCSS.formControl}`} name="confirm_password" placeholder="Confirm Password" onChange={handleConfirmPasswordChange} />
                    </div>
                    
                    {errors?.length !== 0 && <p className={errors !== 'Password matched!' ? "fs-6 text-center text-danger" : "fs-6 text-center text-success"}>{errors}</p>}
                    <div className={`form-group ${RegisterCSS.formGroup}`}>
                        <button type="submit" className="btn btn-success btn-md btn-block px-4">Register Now</button>
                    </div>
                    <div className='text-center'>Already have an account? <Link to='/login' className="link-item">Login</Link></div>
                </form>
                <ToastContainer />
            </div>
        </>
    );
}