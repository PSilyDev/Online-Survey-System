import ResultCSS from './css/ResultStyling.module.css';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../Context/LoginContext';

function Result() {
  const {setShowEditButton} = useContext(LoginContext);
  
  const [responses, setResponses] = useState([]);
  
  const [categories, setCategories] = useState([]);

  const [nameSelected, setNameSelected] = useState('');

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

      axios.get('http://localhost:4000/survey-api/surveys', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      })
      .then(categ => setCategories(categ.data.payload || []))
      .catch(error => console.log('Error in fetching!!!', error));
  }
  catch(error){
      console.log('Error fetching survey data : ', error);
  }
}, [])


  function handleNameSelect(event){
    setNameSelected(event.target.value);
  }

  return (
    <>
    <div className={ResultCSS.resultSurvey}>
    <div className={ResultCSS.containerStyle}>
      <div className={ResultCSS.rowStyle}>
        <div className={ResultCSS.colWidth50}>
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