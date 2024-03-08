import { useContext, useEffect, useRef } from "react";
import { LoginContext } from "../Context/LoginContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


function PrivateRoute({children}) {
    const location = useLocation();
    const {showProfile, refreshed} = useContext(LoginContext);
    const navigate = useNavigate();
    // const prevLocationRef = useRef(null);


    useEffect(() => {
        // console.log('Session storage prev path - ', sessionStorage.getItem('prevPath'));
        if(showProfile && location.pathname !== '/login') {
            sessionStorage.setItem('prevPath', location.pathname);
            // console.log('stored in sessionStorage : ', location.pathname);
        }
        // prevLocationRef.current = location.pathname;
    }, [showProfile, location.pathname]);

    
   
        // console.log('pointer has reached here');
        // showProfile ? children : <Navigate to="/login"/>
        // showProfile ? children : <Navigate to='/login'></Navigate>
        if(!showProfile && location.pathname !== '/login') {

            const prevPath = sessionStorage.getItem('prevPath');
            if(prevPath){
                return <Navigate to={prevPath} />
            }
            else{
                return <Navigate to='/login' />
            }
        }
        return children;
    
}

export default PrivateRoute