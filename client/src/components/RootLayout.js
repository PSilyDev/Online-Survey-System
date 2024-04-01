import React from "react";
import './RootLayout.css';

import { useContext } from "react";
import { LoginContext } from "../Context/LoginContext";
import { Outlet, useLocation, Link } from "react-router-dom/dist";

import Header from "./Header/Header";
import Footer from "./Additional Components/Footer";


export default function RootLayout(){ 
    const {showProfile} = useContext(LoginContext);
    const location = useLocation();
    return( 
    <div className="mainClass">
        <div className="headerbar">
            <Header /> 
        </div> 
        { 
            showProfile? 
            ( 
                <> 
                    <div className="sidenav"> 
                    
                        <div className="seperator" style={{marginTop: '0px'}}></div> 
                        <Link to='addSurvey' className={location.pathname === '/addSurvey' ? 'active' : ''}>Add Survey</Link> 
                        <div className="seperator"></div> 
                        <Link to='viewSurvey' className={location.pathname === '/viewSurvey' ? 'active' : ''}>View Survey</Link> 
                        <div className="seperator"></div> 
                        <Link to='postSurvey' className={location.pathname === '/postSurvey' ? 'active' : ''}>Post Survey</Link> 
                        <div className="seperator"></div> 
                        <Link to='result' className={location.pathname === '/result' ? 'active' : ''}>View Responses</Link> 
                    </div> 
                    <div className="main-layout" style={{minHeight:'90vh'}}> 
                        <Outlet /> 
                        {/* Outlet is a component used to render child routes within a parent route component(RootLayout), serves as a placeholder where child routes are rendered */}
                    </div> 
                    <div className="footerbar">
                        <Footer />
                    </div>
                </> 
            ) : 
            (
                <>
                    <div style={{minHeight:'80vh'}}> 
                        <Outlet /> 
                    </div>
                    <Footer />
                </>
            ) 
        }
    </div> 
    );
}
