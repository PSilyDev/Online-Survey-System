import { useContext, useEffect } from "react";
import { LoginContext } from "./Context/LoginContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";




export default function VerifyToken(){
    const {userData, setUserData, setShowProfile} = useContext(LoginContext);
    const navigate = useNavigate()
    useEffect(() => {

    

    console.log('inside authUser');
    const authToken = localStorage.getItem('token');
    if(!authToken){
        // token not present redirect to login
        navigate('/login');
        // console.log('token not found');
    }
    else{
        try{
            const decodedToken = jwtDecode(authToken)
            console.log('p2 : token data - ', decodedToken)
            const currentTime = Date.now() /1000 // convert to sec

            if(decodedToken.exp < currentTime){
                setShowProfile(false);
                setUserData({});
                alert("Session expired. Login again!")
                navigate('/login')
            }
            else if(decodedToken.username !== userData.username){
                setShowProfile(false);
                setUserData({});
                // alert("Invalid Session. Login again!")
                navigate('/login')
            }
            else{
                console.log('p2 routing to fetchSurveyData')
                // fetchSurveyData();
            }
        }
        catch(error){
            console.log('Error decoding token: ', error);
            return true
        }
    }
    return false;
}, [])
    // useEffect(() => {
    //     authUser(userData.username, setUserData, setShowProfile, navigate);
    // }, [userData, setUserData, setShowProfile])

}

//export default VerifyToken
