import { LoginContext } from './Context/LoginContext';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom/dist';
import './App.css';


import Register from './components/Header/Header Components/Register';
import Login from './components/Header/Header Components/Login';
import EditProfile from './components/Header/Header Components/EditProfile';
import RootLayout from './components/RootLayout';
import AddSurvey from './components/Core Components/AddSurvey';
import ViewSurvey from './components/Core Components/ViewSurvey';
import TakeSurvey from './components/Core Components/TakeSurvey';
import Result from './components/Core Components/Result';
import PostSurvey from './components/Core Components/PostSurvey';
import MainPage from './components/MainPage';
import PrivateRoute from './components/PrivateRoute';
import { jwtDecode } from 'jwt-decode';
import Test from './components/Test';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  

  //userData is for string what user is currently Logged In
  const [userData, setUserData] = useState({});

  //showProfile is a check for displaying 'Register', 'Login' buttons once the user LogsIn
  const [showProfile, setShowProfile] = useState(false);

  //showEdit buttons is a check for Edit Button
  const [showEditButton, setShowEditButton] = useState(true);

  const [refreshed, setRefresh] = useState(false);

  
  
  useEffect(() => {
    if(Object.keys(userData).length === 0 && localStorage.getItem('userCred') !== null){
      //authenticate the token
      const authToken = localStorage.getItem('token');
      const userCred = JSON.parse(localStorage.getItem('userCred'));

        if(!authToken){
            console.log('token not found');
        }
        else{
            try{
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
                    // navigate('/login')
                }
                else{
                  setRefresh(true);
                  let data = JSON.parse(localStorage.getItem('userCred'));
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
  }, [])

 
  // useEffect(() => {
  //   if(refreshed){
  //     // navigate(prevLocation);
  //     sessionStorage.setItem('prevPath', window.location.pathname);
    
  //   }
  // }, [refreshed]);
  
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
        },
        // {
        //   path:'test',
        //   element: <Test />
        // },
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
    
    </>
  );
}

export default App;
