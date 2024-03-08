import Logo from '../../Logo/survey-high-resolution-logo-transparent.png';
import HeaderCSS from './HeaderStyling.module.css';
import { useContext} from "react";
import { LoginContext } from "../../Context/LoginContext";
import { Link, useNavigate } from "react-router-dom/dist";

export default function Header() {
    const navigate = useNavigate();
    const {userData, showProfile, setShowProfile, setUserData, showEditButton, setShowEditButton} = useContext(LoginContext);

    
    function handleLogoutClicked(){
        localStorage.removeItem('token');
        localStorage.removeItem('userCred');
        sessionStorage.removeItem('prevPath');
        setShowProfile(false);
        setUserData({});
        alert("Logged out successfully. Routing to Login!")
    }

    function handleRoute(event){
        navigate(event.target.value);
    }

    return(
        <>
            <div className={HeaderCSS.navbar}>
                <Link to='/' className={HeaderCSS.logo}>
                    <img className={HeaderCSS.logoImg} src={Logo} alt="Logo" />
                </Link>
                <div className={HeaderCSS.links}>
                    {
                        showProfile?
                        (
                            <>
                            {
                                showEditButton?
                                (
                                    <>
                                        <button className={`${HeaderCSS.profileBtn} ${HeaderCSS.btnn}`} disabled={true}>Hello, {userData.first_name}!</button>
                                        <Link to='/editProfile' className={HeaderCSS.btnn} onClick={() => setShowEditButton(false)}>Edit Profile</Link>
                                        <Link to='/Login' className={HeaderCSS.btnn} onClick={handleLogoutClicked}>Logout</Link>
                                    </>
                                ) : 
                                (
                                    <>
                                        <Link to='/addSurvey' className={HeaderCSS.btnn} onClick={() => setShowEditButton(true)}>Return</Link>
                                        <Link to='/Login' className={HeaderCSS.btnn} onClick={handleLogoutClicked}>Logout</Link>
                                    </>
                                )
                            }
                            <select
                                onChange={handleRoute}
                                className={HeaderCSS.selectType}
                            >
                                    
                                <option value='/addSurvey'>Add Survey</option>
                                <option value='/viewSurvey'>View Survey</option>
                                <option value='/postSurvey'>Post Survey</option>
                                <option value='/result'>View Response</option>
                            </select>
                        </>
                        ) : 
                        (
                            <>
                                <Link to="/register" className={HeaderCSS.btnn}>Register</Link>
                                <Link to="/login" className={HeaderCSS.btnn}>Login</Link>
                            </>
                        )
                    }                    
                </div>
            </div>
        </>
    );
}