import LoginCSS from './LoginStyling.module.css';
import axios from 'axios';
import { LoginContext } from "../../../Context/LoginContext";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login(){

    const navigate = useNavigate();

    //fetching data from Context that, the states are stored in App.js
    //userData stores the current user that is Logged In
    const {userData, setUserData, setShowProfile} = useContext(LoginContext);
    // const [userData, setUserData] = useState({})

    //error state for error in posting data to the json-server and also for validation
    const [errors, setErrors] = useState();


    function handleChange(event){
        let name = event.target.name;
        let value = event.target.value;

        setUserData({...userData, [name]: value});
        setErrors("")
    }

    function handleLogin(response){
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userCred', JSON.stringify(user));

        let data = response.data.user

        let updatedUserData = { "id" : data._id, "username": data.username, "email": data.email, "first_name": data.first_name, "last_name": data.last_name, "token": token }

        setUserData(updatedUserData);
        setShowProfile(true);

    }

    async function handleFormSubmit(event){
        event.preventDefault();

        //validate if username is entered or not?
        if(!userData?.username){
            setErrors('Please enter username!');
        }

        //validate if password is enetered or not?
        else if(!userData?.password){
            setErrors('Please enter password!');
        }
                
        else{
        
            //now the form is validated and submitted we need to check whether the usernamee and the password matched the registered user data

            try{
                const res = await axios.post('http://localhost:4000/user-api/user', userData);
                console.log('fetched data - ', res)
                if(res.data.message === "login success"){
                    handleLogin(res);
                   
                    navigate("/addSurvey");
                    
                }
                else{
                    setErrors(res.data.payload);
                }
            }catch(err){
                setErrors(err.message);
            }

        }
    }

    console.log('userData - ', userData);
    return(
        <>
            <div className={LoginCSS.loginForm}>
                <form onSubmit={handleFormSubmit}>
                    <h2>Login</h2>
                    <p className={LoginCSS.hintText}>Already registered? Login to you account</p>

                    <div className={`form-group ${LoginCSS.formGroup}`}>
                        <input type="text" className={`form-control ${LoginCSS.formControl}`} name="username" placeholder="Username" onChange={handleChange} />
                    </div>
                    <div className={`form-group ${LoginCSS.formGroup}`}>
                        <input type="password" className={`form-control ${LoginCSS.formControl}`} name="password" placeholder="Password" onChange={handleChange} />
                    </div>         
                    {errors?.length !== 0 && <p className="fs-6 text-center text-danger">{errors}</p>}
                    <div className={`form-group ${LoginCSS.formGroup}`}>
                        <button type="submit" className="btn btn-success btn-md btn-block px-4">Login</button>
                    </div>
                    <div className='text-center'>Don't have an account? <Link to='/register' className="link-item">Register</Link></div>
                </form>
            </div>
        </>
    );
}