import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
// import './css/ResultStyling.css';
import ResultCSS from './css/ResultStyling.module.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { LoginContext } from '../../Context/LoginContext';

function Result() {

  const navigate = useNavigate()
  
  const {userData, setUserData, setShowProfile, setShowEditButton} = useContext(LoginContext);
  

  const [responses, setResponses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [nameSelected, setNameSelected] = useState('');


//   useEffect(() => {
//     const authToken = localStorage.getItem('token');
//     if(!authToken){
//         // token not present redirect to login
//         navigate('/login');
//         // console.log('token not found');
//     }
//     else{
//         try{
//             const decodedToken = jwtDecode(authToken)
//             console.log('p2 : token data - ', decodedToken)
//             const currentTime = Date.now() /1000 // convert to sec

//             if(decodedToken.exp < currentTime){
//                 setShowProfile(false);
//                 setUserData({});
//                 alert("Session expired. Login again!")
//                 navigate('/login')
//             }
//             else if(decodedToken.username !== userData.username){
//                 setShowProfile(false);
//                 setUserData({});
//                 // alert("Invalid Session. Login again!")
//                 navigate('/login')
//             }
//             else{
//                 console.log('p2 routing to fetchSurveyData')
//                 fetchSurveyData();
//             }
//         }
//         catch(error){
//             console.log('Error decoding token: ', error);

//         }
//     }
// }, [])

// async function fetchSurveyData() {
//   try{
      
//       const response = await axios.get('http://localhost:4000/response-api/responses', {
//           headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//       });
//       console.log('pointer 2 : response receieved from get request - ', response.data)
//       setResponses(response.data.payload || [])

//       const categ = await axios.get('http://localhost:4000/survey-api/surveys', {
//           headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//       });
//       console.log('pointer 2 : response receieved from get request - ', categ.data)
//       setCategories(categ.data.payload || [])
//   }
//   catch(error){
//       console.log('Error fetching survey data : ', error);
//   }
// }

useEffect(() => {
  setShowEditButton(true);
  try{
      
      axios.get('http://localhost:4000/response-api/responses', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      })
      .then(response => setResponses(response.data.payload || []))
      .catch(error => console.log('Error in fetching!!!', error));
      // console.log('pointer 2 : response receieved from get request - ', response.data)

      axios.get('http://localhost:4000/survey-api/surveys', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      })
      .then(categ => setCategories(categ.data.payload || []))
      .catch(error => console.log('Error in fetching!!!', error));
      // console.log('pointer 2 : response receieved from get request - ', categ.data)
  }
  catch(error){
      console.log('Error fetching survey data : ', error);
  }
}, [])

  // useEffect(() => {
  //   axios.get('http://localhost:4000/response-api/responses')
  //       .then(response => setResponses(response.data.payload || []))
  //       .catch(error => console.log('Error in fetching!!!', error));
  // }, []);

  // useEffect(() => {
  //   axios.get('http://localhost:4000/survey-api/surveys')
  //       .then(response => setCategories(response.data.payload || []))
  //       .catch(error=> console.log('Error in fetching!!!', error));
  // }, []);

  console.log('responses - ', responses);
  console.log('categories - ', categories);

  function handleNameSelect(event){
    setNameSelected(event.target.value);
  }
  console.log('name selected - ', nameSelected);
  return (
    <>
    <div className={ResultCSS.resultSurvey}>
    <div className={ResultCSS.containerStyle}>
      <div className={ResultCSS.rowStyle}>
        <div className={ResultCSS.colWidth50}>
      {/* <label htmlFor='response' className='form-label'>Select Response: </label> */}
      <select id='response' className='form-select' onChange={handleNameSelect}>
        <option value=''>Select Response</option>
        {
          responses.map(response => (
            <option key={response.id} value={response.id}>{response.name} - {response.category_name} - {response.survey_name}</option>
          ))
        }
      </select>
      </div>
      </div>
      {
        responses
        .filter(item => item.id === nameSelected)
        .map(response => {
          return response.answers.map((ans,index) => {
            return (
              <div className={ResultCSS.responseStyle}>
                <div className={ResultCSS.colWidth50}>
                <label htmlFor='question' className='form-label' key={ans.question}>Question</label>
                <input
                  type='text'
                  className='form-control'
                  value={ans.question}
                  readOnly
                />
                </div>
                <div className={ResultCSS.colWidth50}>
                <label htmlFor='answer' className='form-label' key={ans.answer}>Response</label>
                <input
                  type='text'
                  className='form-control'
                  value={ans.answer}
                  readOnly
                />
                </div>
              </div>
            )
          })
        })
      }
      </div>
      </div>
    </>
  )
}

export default Result