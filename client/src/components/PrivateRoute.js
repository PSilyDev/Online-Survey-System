import { useContext, useEffect } from "react";
import { LoginContext } from "../Context/LoginContext";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function PrivateRoute({ children }) {       // PrivateRoute acts as a partent compoenent
    //get the location of children component
    const location = useLocation();     // hooke from react router DOM is used to get the current location pf the user

    const { showProfile } = useContext(LoginContext);

    // store the current location in the sessionStorage except login
    useEffect(() => {
        if (showProfile && location.pathname !== "/login") {
            sessionStorage.setItem("prevPath", location.pathname);
        }
    }, [showProfile, location.pathname]);

    // showprofile is false -> page refreshed
    if (!showProfile && location.pathname !== "/login") {
        // get path from session storage and naviagte
        const prevPath = sessionStorage.getItem("prevPath");
        if (prevPath) {
            return <Navigate to={prevPath} />;
        } else {
            return <Navigate to="/login" />;
        }
    }
    return children;
}

export default PrivateRoute;
