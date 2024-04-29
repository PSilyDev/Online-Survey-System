import { LoginContext } from './Context/LoginContext';

import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom/dist';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';


// import Register from './components/Header/Header Components/Register';
import Register from './components/Additional Components/Register';
// import Login from './components/Header/Header Components/Login';
import Login from './components/Additional Components/Login'
// import EditProfile from './components/Header/Header Components/EditProfile';
import EditProfile from './components/Additional Components/EditProfile'
import RootLayout from './components/RootLayout';
import AddSurvey from './components/Core Components/AddSurvey';
// import ViewSurvey from './components/Core Components/ViewSurvey';
import ViewSurvey from './components/Core Components/ViewSurvey';
import TakeSurvey from './components/Core Components/TakeSurvey';
// import TakeSurvey2 from './components/Core Components/TakeSurvey2';
import Result from './components/Core Components/Result';
import PostSurvey from './components/Core Components/PostSurvey';
import MainPage from './components/MainPage';
import PrivateRoute from './components/PrivateRoute';
import Test from './components/Additional Components/Test';
import TermsOfService from './components/Additional Components/TermsOfService';
import AboutUs from './components/Additional Components/AboutUs';
import CategorySurveyInput from './components/Reusable Components/CategorySurveyInput';

function App() {

  //userData is for string what user is currently Logged In
  const [userData, setUserData] = useState({});

  //showProfile is a check for displaying 'Register', 'Login' buttons once the user LogsIn
  const [showProfile, setShowProfile] = useState(false);

  //showEdit buttons is a check for Edit Button
  const [showEditButton, setShowEditButton] = useState(true);

  // checking if the page was refreshed
  const [refreshed, setRefresh] = useState(false);

  
  
  useEffect(() => {       //refresh logic - reinstate userData (Note - refresh return to same page in PrivateRoute)

    //userData state is empty but userCred Obj present, stored during Login
    if(Object.keys(userData).length === 0 && localStorage.getItem('userCred') !== null){

      //step 1 -authenticate the token
      const authToken = localStorage.getItem('token');
      const userCred = JSON.parse(localStorage.getItem('userCred'));

        if(!authToken){
            console.log('token not found');
        }
        else{
            try{
              // decode the jwt token, we get - username, exp, iat
                const decodedToken = jwtDecode(authToken)
                const currentTime = Date.now() /1000 // convert to sec

                if(decodedToken.exp < currentTime){
                    setShowProfile(false);
                    setUserData({});
                    localStorage.removeItem('token');
                    localStorage.removeItem('userCred');
                    sessionStorage.removeItem('prevPath');
                    // alert("Session expired. Login again!")
                    toast.error("Session expired. Login again!",{
                      autoClose: 2000
                  })
                }
                else if(decodedToken.username !== userCred.username){
                    setShowProfile(false);
                    setUserData({});
                    // alert("Invalid Session. Login again!")
                    toast.error("Invalid Session. Login again!",{
                      autoClose: 2000
                  })
                }
                else{
                  // set the refresh state to true
                  setRefresh(true);
                  let data = JSON.parse(localStorage.getItem('userCred'));
                  // update the userData state with the data stored in the localStorage
                  let updatedUserData = { "id" : data._id, "username": data.username, "email": data.email, "first_name": data.first_name, "last_name": data.last_name, "token": authToken }
                    setUserData(updatedUserData);
                    setShowProfile(true);
                }
            }
            catch(error){
                console.log('Error decoding token: ', error);

            }
        }
    }
  }, []) // dependency array is empty, it will run only once, when the children components are refreshed. Why? coz global state are defined in App.js it will re-render everytime there's a change.

  
  //router component 'react-router-dom'
  const browseRoute = createBrowserRouter([
    {
      path:'',
      element:
      <RootLayout />,
      children:[
        {
          path:'',
          element: 
          <MainPage />
        },
        {
          path:'mainPage',
          element:
          <MainPage />
        },
        {
          path:'login',
          element: <Login />
        },
        {
          path:'register',
          element: <Register />
        },
        {
          path:'editProfile',
          element: 
          <PrivateRoute >
            <EditProfile />
          </PrivateRoute>
        },
        {
          path:'addSurvey',
          element:
          <PrivateRoute>
            <AddSurvey />
            {/* <CategorySurveyInput /> */}
          </PrivateRoute>
        },
        {
          path:'viewSurvey',
          element: 
          <PrivateRoute>
            <ViewSurvey />
          </PrivateRoute>
        },
        {
          path:'postSurvey',
          element: 
          <PrivateRoute>
            <PostSurvey />
          </PrivateRoute>
        },
        {
          path:'result',
          element: 
          <PrivateRoute>
            <Result />
          </PrivateRoute>
        },
        {
          path:'takeSurvey/:categoryName/:surveyName',
          element: <TakeSurvey />
          // <TakeSurvey />
        },
        {
          path: 'tos',
          element: <TermsOfService />
        },
        {
          path: 'aboutUs',
          element: <AboutUs />
        },
        {
          path:'*',
          element: <Test />
        }
      ]
    }
  ])

  return (
    <>
    {/* Using Context to pass data through all the components */}
      <LoginContext.Provider value={{userData, setUserData, showProfile, setShowProfile, showEditButton, setShowEditButton, refreshed, setRefresh}}>
        <RouterProvider router={browseRoute} />
      </LoginContext.Provider>
      <ToastContainer />
    </>
  );
}

export default App;
