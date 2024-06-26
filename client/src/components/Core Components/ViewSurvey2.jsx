import React from 'react';
import ViewSurveyCSS from './css/ViewSurveyStyling.module.css'
import axios from 'axios';

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../Context/LoginContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewSurvey() {

  const {setShowEditButton} = useContext(LoginContext);

  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);//storing fetched data from DB
  
  const [selectedCategory, setSelectedCategory] = useState('');//selected category from the dropdown
  
  const [surveys, setSurveys] = useState([]);//stores all the surveys from the category selected

  const [selectedSurvey, setSelectedSurvey] = useState('');//stores the survey selected from dropdown by the user

  const [surveyInfo, setSurveyInfo] = useState(
    {
      id: '',
      category: '',
      surveys: [
            {
                name: '',
                questions:[
                    {
                        id: '',
                        text: '',
                        type: '',
                        options: []
                    }
                ]
            }
        ]
      }
  )//for storing the category, survey, questions based on the category, survey name selected

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);//for storing the current question index
  
  const [editQuestionClicked, setEditQuestionClicked] = useState(false);

  const [submitEditBtnClicked, setSubmitEditBtnClicked] = useState(false);

  const [question, setQuestion] = useState({});//if user clicks edit button, and updates the question

  const [option, setOption] = useState({})//if user clicks update button, and updates the option

  const [errors, setErrors] = useState("");
      


  //fetching stored data from json-server and stroing the categories state
  useEffect(() => {
    setShowEditButton(true);
    axios.get('http://localhost:4000/survey-api/surveys', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => setCategories(response.data.payload || []))
        .catch(error => console.log('Error fetching categories : ', error));
  }, []);

  
  //event function when the user selects the category from the dropdown
  function handleCategoryChange(event){

    //update the selectedCategory based on the category selected
    setSelectedCategory(event.target.value);
    setSelectedSurvey('');

    //find the particular category from the stored data
    const selectedCategoryObject = categories.find(category => category._id === event.target.value);
    
    //update the surveyInfo state
    setSurveyInfo({
      _id: event.target.value,
      category_name: selectedCategoryObject.category_name,
      surveys: [],
    })
  }


  //using useEffect to get all the surveys from the selected category
  useEffect(() => {
    const selectedCategoryObject = categories.find(category => category._id === selectedCategory);
    if(selectedCategoryObject) {

      //store all the surveys in the surveys state
      setSurveys(selectedCategoryObject.surveys || []);
    }
  }, [selectedCategory, categories]);


  // when the user selects the survey from dropdown
  function handleSurveyChange(event){
    // updating the selectedSurvey state to capture the survey selected
    setSelectedSurvey(event.target.value);

    // find the survey selected from the surveys state to fetch the questions
    const selectedSurveyObject = surveys.find(survey => survey.survey_name === event.target.value);
    if(selectedSurveyObject){

      // updatinf the surveyInfo state, now it stores the category, survey, questions
      setSurveyInfo({
        ...surveyInfo,
        surveys: [
          {
            name: selectedSurveyObject.survey_name,
            questions: selectedSurveyObject.questions || [],
          },
        ],
      });

      setSurveys(prevSurveys => {
        const updatedSurveys = prevSurveys.map(survey => 
          survey.survey_name === event.target.value ? {...selectedSurveyObject} : survey);
        return updatedSurveys;
      })
    }
  }
  


  // triggered when user clicks next question button, we update the currentQuestionIndex state by 1
  function handleNextQuestion(){
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);

    setSubmitEditBtnClicked(false);
  }

  //triggered when the user clicks the edit button
  function handleEditQuestion(event){
    setEditQuestionClicked(true);

    setSubmitEditBtnClicked(true);
  }


  //when the user clicks update button and updates the question
  function handleQuestionChange(event){
    
    let name = event.target.name;
    let value = event.target.value;
      
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      id: currentQuestionIndex, 
      [name]: value,
    }));
  }

  //when the user clicks the update button and updates the options
  function handleOptionChange(event){

    let name = event.target.name;
    let value = event.target.value;

    setOption({...option, [name]: value});
  }


  
  //when the user finally submits the form after updation
  async function handleEditSubmit(event){
    try{
      if(!question){
        // console.log("empty question")
        setErrors("Please enter question")
      }
      else if(Object.keys(option).length === 0){
        // console.log("Enter option value!!")
        setErrors("Please enter option value")
      }

      else{
        ///geta ll the values of the option in the form of array
        const updatedOptions = Object.values(option);

        const updatedQuestion = question.text;


        //get the text of the updated question
        const surveyIndex = surveys.findIndex(survey => survey.survey_name === selectedSurvey); 
        
        if(surveyIndex !== -1){
          const questionIndex = surveys[surveyIndex].questions.findIndex(que => que.id === (question.id + 1));
          
        
          if(questionIndex !== -1){
            
            surveys[surveyIndex].questions[questionIndex].text = updatedQuestion;
            surveys[surveyIndex].questions[questionIndex].options = updatedOptions;


            surveyInfo.surveys = surveys;
            
              setSurveyInfo({
                ...surveyInfo
              });
          }
        }

        setSubmitEditBtnClicked(false);
        setEditQuestionClicked(false)
    
     
        const localAPI = await axios.put('http://localhost:4000/survey-api/replaceSurvey', surveyInfo, {
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(localAPI.data.message = "survey updated"){
          toast.success('Updated successfully!', {autoClose: 1500})
        }
        else if(localAPI.data.message = "survey not updated"){
          toast.error('Sorry! Unable to edit.', {autoClose: 1500})
        }
      }
    }catch(error){
      // console.log('error posting data, err - ', error)
      setErrors(error)
    }
  }


  function handleEndOfQuestion(event){
    toast.success('End of Question!', {autoClose: 2000})
    setTimeout(() => {
      navigate('/postSurvey')
    }, 2500)
  }

  return (
    <div className={ViewSurveyCSS.viewSurvey}>
    <div className={ViewSurveyCSS.containerStyle}>
      <div className={ViewSurveyCSS.rowStyle}>
        <div className={ViewSurveyCSS.dropdownStyle}>
          <div className={ViewSurveyCSS.colWidth45}>
          
          {/* selecting the category from the dynamic loaded data from DB */}
          {/* when the user selects the category, handleCategoryChange event function is generated */}
          <select id='category' className='form-select' value={selectedCategory} required onChange={handleCategoryChange}>
            <option value=''>Select Category</option>
            {
              // mapping all the categories in the form of dropdown
              categories.map(category => (
                <option key={category._id} value={category._id}>{category.category_name}</option>
              ))
            }
          </select>

        </div>
        {
          // only render survey dropdown when te user selects the category
          selectedCategory && (
            <div className={ViewSurveyCSS.colWidth45}>

              {/* when the user selects the survey from the dropdown hndleSurveyChange is triggered */}
              <select id='survey' className='form-select' value={selectedSurvey} required onChange={handleSurveyChange}>
                <option value="">Select Survey</option>
                {/* dynamically fetching all the surveys under a category and displaying in the form of dropdown */}
                {surveys.map(survey => (
                  <option key={survey.survey_name} value={survey.survey_name}>{survey.survey_name}</option>
                ))}
              </select>

            </div>
          )
        }
      </div>
      </div>

     
     {/* once the user selects the survey it is loaded  */}
      {selectedSurvey && (
        <div>
          {surveys
                .filter(surveyItem => surveyItem.survey_name === selectedSurvey)
                .map(surveyItem => (

                  // match the survey selected from the surveys state
                  <div key={surveyItem.survey_name}>

                    <form>
                    
                    {/* display the question stored in that survey */}
                    {surveyItem.questions.slice(currentQuestionIndex, currentQuestionIndex + 1).map(question => (
                        <div className={ViewSurveyCSS.rowStyle} key={question.id}>
                          <div className={ViewSurveyCSS.colWidth75}>

                            {/* question loaded based in currentQuestionIndex state, initially set to 1 */}
                            <label htmlFor='question'>Question - {question.id}</label>
                              <input
                                type='text'
                                placeholder={question.text}
                                name='text'
                                required
                                // if user clicks the editquestion button, and ecters text it gets handled by handleQuestionChange
                                onChange={handleQuestionChange}
                                readOnly={!editQuestionClicked}
                              />

                          </div>
                          <div className='row-style'>

                          {question.options.map((option, index) => (
                            <div className={ViewSurveyCSS.colWidth75} key={index}>

                              {/* listing all the options based on the question */}
                              <input
                                type='text'
                                name={`option${index+1}`}
                                placeholder={option}
                                required
                                // if the user clicks edit question, and updates the text it gets handled by handelOptionChange
                                onChange={handleOptionChange}
                                readOnly={!editQuestionClicked}
                              />
                            </div>
                          ))}
                        </div>
                        </div>
                    ))}
                      </form>
                      <div className={ViewSurveyCSS.rowStyle}>
                    {(currentQuestionIndex < surveyItem.questions.length - 1 && !submitEditBtnClicked && !editQuestionClicked) && (
                    
                     <button className={ViewSurveyCSS.functionalBtns} onClick={handleNextQuestion}>Next</button>
                      
                    )}
                    {currentQuestionIndex <= surveyItem.questions.length -1 && (
                      <>
                        {
                        
                        !editQuestionClicked && !submitEditBtnClicked ? 
                        (<button className={ViewSurveyCSS.functionalBtns} onClick={handleEditQuestion}>Edit</button>) : (undefined)
                        }
                        {
                          editQuestionClicked && submitEditBtnClicked ?
                          (<button className={ViewSurveyCSS.functionalBtns} onClick={handleEditSubmit}>Submit Edit</button>) : (undefined)
                        }
                      </>
                    )}
                    {
                       !submitEditBtnClicked && (currentQuestionIndex === surveyItem.questions.length -1) && (
                        <button className={ViewSurveyCSS.functionalBtns} onClick={handleEndOfQuestion}>Submit</button>
                      )
                    }
                    </div>
                  </div>
                ))}
        </div>
      )}
    </div>
    <ToastContainer />
    {errors?.length!==0 && <p className='fs-6 text-center text-danger'>{errors}</p> }
    </div>
  );
}

export default ViewSurvey;