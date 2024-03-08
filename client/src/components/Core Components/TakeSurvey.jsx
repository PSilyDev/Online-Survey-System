import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import './css/TakeSurveyStyling.css'
import TakeSurveyCSS from './css/TakeSurveyStyling.module.css';

function TakeSurvey() {

  const {categoryName, surveyName} = useParams();

  const [initialInfo, setInitialInfo] = useState('');

  const [categoryButtonSubmitted, setCategoryButtonSubmitted] = useState(false);

  const [nextQueButtonPressed, setNextQueButtonPressed] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [optionSelected, setOptionSelected] = useState([]);

  const [surveyData, setSurveyData] = useState(
    {
      id: '',
      name: '',
      email: '',
      category_name: '',
      survey_name: '',
      answers: [
        // {
        //   questionId: '',
        //   answer: '',
        // },
      ]
    }
  )

  const [fetchedData, setFetchedData] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:4000/survey-api/public')
        .then(response => setFetchedData(response.data.payload || []))
        .catch(error => console.log('Error fetching categories', error));
  }, []);

  console.log('fetched data take Survey - ', fetchedData);

  function handleInfoChange(event){
    let name = event.target.name;
    let value = event.target.value;

    setInitialInfo({
      ...initialInfo,
      [name]: value
    })
  }


  function handleInfoSubmit(event){
    event.preventDefault();
    console.log('button pressed!!!', event);
    setCategoryButtonSubmitted(true);
  }

  function handleOptionChange(event){
    

   const name = event.target.name;
   const value = event.target.value;

   setOptionSelected([...optionSelected, event.target.value]);
  }
  

  function handleOptionSubmit(event, currentSurveyItem){
    event.preventDefault();

    console.log('pointer has reached here - , survey passed - ', currentSurveyItem);
    console.log('pointer has reached here, option selected - ', optionSelected);
    setSurveyData({
      ...surveyData,
      id: initialInfo.id,
      name: initialInfo.name,
      email: initialInfo.email,
      category_name: categoryName,
      survey_name: surveyName,
      answers: [
        ...surveyData.answers,
        {
          question: currentSurveyItem.questions[currentQuestionIndex].text,
          answer: optionSelected,
        },
      ]
    })

    setNextQueButtonPressed(true);
    setOptionSelected([]);
  }

  function handleNextQuestion(event){
    event.preventDefault();

   
    setNextQueButtonPressed(false);


    

    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  }

  function handleSubmitSurvey(event, currentSurveyItem){
    event.preventDefault();
    

    setSurveyData((prevSurveyData) => ({
      ...prevSurveyData,
      answers: [
        ...prevSurveyData.answers,
        {
          question: currentSurveyItem.questions[currentQuestionIndex].text,
          answer: optionSelected,
        }
      ]
    }))

    try{
      axios.post('http://localhost:4000/response-api/response', surveyData)
        .then(alert('Submitted Successfully!!!')

        )
      
  } catch(error){
      console.log('Error adding survey: ', error);
  }
  }

  console.log('survey data to be passed - ', surveyData)



  return (
    <>
    <div className={TakeSurveyCSS.takeSurvey}>
      <div className={TakeSurveyCSS.containerStyle}>
        {/* <form onSubmit={handleSubmitSurvey}> */}
        <form>
          <div className={TakeSurveyCSS.rowStyle}>
            <div className={TakeSurveyCSS.dropdownStyle}>
              <div className={TakeSurveyCSS.colWidth35}>
                <label htmlFor='name' className='form-label'>Name</label>
                  <input
                      type='text'
                      className='form-control'
                      name='name'
                      required
                      onChange={handleInfoChange}
                  />
                </div>
        <div className={TakeSurveyCSS.colWidth35}>
          <label htmlFor='email' className='form-label'>Email</label>
          <input 
              type='text'
              className='form-control'
              name='email'
              required
              onChange={handleInfoChange}
          />
        </div>
        <div className={TakeSurveyCSS.colWidth35}>
          <label htmlFor='id' className='form-label'>ID</label>
          <input 
              type='text'
              className='form-control'
              name='id'
              required
              onChange={handleInfoChange}
          />
        </div>
        </div>
        </div>
        <div className={TakeSurveyCSS.dropdownStyle}>
        <div className={TakeSurveyCSS.colWidth45}>
          <input
          type='text'
          className='form-control'
          value={categoryName}
          disabled
        />
        </div>
        <div className={TakeSurveyCSS.colWidth45}>
        <input
          type='text'
          className='form-control'
          value={surveyName}
          disabled
        />
        </div>
        </div>
        {
          !categoryButtonSubmitted ? 
          
          (<div className={TakeSurveyCSS.rowStyle}>
          <button type='button' className={TakeSurveyCSS.functionalBtns} onClick={handleInfoSubmit}>Submit</button>
        </div>) :

        
          
          (
            <>
            <div className={TakeSurveyCSS.rowStyle}>
            {
              
                  fetchedData.filter(data => data.category_name === categoryName) 
                  .map(category => category.surveys.filter(surveyItem => surveyItem.survey_name === surveyName)
                    .map(survey => 
                      survey.questions.slice(currentQuestionIndex, currentQuestionIndex + 1).map(question => (
                      <div key={question.id}>

                        <div className={TakeSurveyCSS.colWidth100}>
                          <label htmlFor='question' className='form-label'>Question - </label>
                          <input
                            type='text'
                            className='form-control'
                            defaultValue={question.text}
                            readOnly
                          />
                        </div>

                        <div className={TakeSurveyCSS.optionStyle}>
                          {question.type === 'text' && (
                            <input
                              className='form-control'
                              type='text'
                              name='input'
                              // required
                              onChange={handleOptionChange}
                            />
                          )}
                          {question.options.map((option, index) => (
                             <>
                             <div className={TakeSurveyCSS.colWidth90} key={index}>
                              <div className={TakeSurveyCSS.colWidth10}>
                                <input
                                  className='form-check-input'
                                  type={question.type}
                                  name='option'
                                  value={option}
                                  // required
                                  onChange={handleOptionChange}
                                />
                              </div>
                            
                              <label
                                className='form-label'
                                htmlFor={`option${index + 1}`}
                              >
                                {option}
                              </label>
                            </div>
                            </>
                          ))}
                        </div>

                        {
                          !nextQueButtonPressed?(<button type='button' className={TakeSurveyCSS.functionalBtns} onClick={(event) => handleOptionSubmit(event, survey)}>Submit</button>):(undefined)
                        }
                        
                        { (currentQuestionIndex < survey.questions.length - 1 && nextQueButtonPressed) && (
                                      
                          <button className={TakeSurveyCSS.functionalBtns} onClick={handleNextQuestion}>Next</button>
                                      
                        )}
                        

                        {
                          (currentQuestionIndex === survey.questions.length -1 && nextQueButtonPressed) && (

                            <button className={TakeSurveyCSS.functionalBtns} type='button' onClick={(event) => handleSubmitSurvey(event, survey)}>Done</button>

                          )
                        }
                      </div>
                    ))
                    ))
                  }
                </div>
            </>
          )
        }
      </form>
      </div>
      </div>
    </>
  )
}

export default TakeSurvey