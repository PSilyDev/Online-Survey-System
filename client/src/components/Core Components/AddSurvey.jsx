import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom/dist';
import { LoginContext } from '../../Context/LoginContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import UpdatedComponent from './withFetchedData';
import CategorySurveyInput from '../Reusable Components/CategorySurveyInput';
import QuestionInput from '../Reusable Components/QuestionInput';


function AddSurvey(props) {

    //for storing fetched data from storeQuestionDB.json/DB
    const fetchedSurveyData = props.data;

    const {setShowEditButton} = useContext(LoginContext);

    const navigate = useNavigate();

    const [surveyInfo, setSurveyInfo] = useState({
        surveys: []
    })//storing surveyData that is to be put, post on json-server/DB

    const [errors, setErrors] = useState("")

    // for storing input values
    const [inputSurveyData, setInputSurveyData] = useState({
        category_name: '',
        survey_name: '',
        question_type: '',
        question_text: '',
        options: [{}],
        flag: 2,
        dupCategoryId: '',
        counter: 1
    })

    // for button rendering
    const [buttonRendering, setButtonRendering] = useState({
        category_survey_name_submitted : false,
    })

    useEffect(() => {
        setShowEditButton(true);
    })

    console.log('(AddSurvey) inputSurveyData - ', inputSurveyData);
    console.log('(AddSurvey) surveyInfo - ', surveyInfo);

    
    function handleCategorySurvey(flagVal, duplicateId, categoryName, surveyName){

        setInputSurveyData({...inputSurveyData, flag: flagVal, dupCategoryId: duplicateId, category_name: categoryName, survey_name: surveyName})
        setButtonRendering({...buttonRendering, category_survey_name_submitted: true})

        if(flagVal === 1){
            // console.log('only category exists');

            //we'll only store the survey information in the surveyInfo state
            
            setSurveyInfo(prevSurveyInfo => ({
                ...prevSurveyInfo,
                surveys: [
                    ...prevSurveyInfo.surveys,
                    {
                        survey_name: surveyName,
                        questions: [],
                    },
                ],
            }));

        }

        else if(flagVal === 2){
            // console.log('nothing exists!!!');
            
            setSurveyInfo((prevSurveyInfo) => ({
                
                category_name: categoryName,
                surveys: [
                    {  
                        survey_name: surveyName,
                        questions: []
                    },
                ],
            }));
        }

    }

    //event function handler when the user submits the form
    async function handleQuestionSubmit(dataPassed){

        let postData;
        let operation;
        let url;

        try{
            if(inputSurveyData.flag === 2){
                // console.log('neither category nor survey exists!')
                // if flag == 2, we'll be posting the surevyInfo that has the category also

                
                postData = dataPassed;
                operation = 'post';
                url = 'http://localhost:4000/survey-api/survey'


            }
            else if(inputSurveyData.flag === 1){
                // console.log('category exists, category - ', fetchedSurveyData.find(category => category._id === inputSurveyData.dupCategoryId)._id)
                // console.log('category exists, surveys - ', [...fetchedSurveyData.find(category => category._id === inputSurveyData.dupCategoryId).surveys, ...surveyInfo.surveys])
                
                // if flag == 1, we'll update the DB using put method

                
                postData = {
                    category_id: fetchedSurveyData.find(category => category._id === inputSurveyData.dupCategoryId)._id,
                    updated_surveys: [...fetchedSurveyData.find(category => category._id === inputSurveyData.dupCategoryId).surveys, ...dataPassed.surveys],
                };
                operation = 'put';
                url = 'http://localhost:4000/survey-api/survey'

            }

            console.log('(AddSurvey) postData = ', postData);
            console.log('(AddSurvey) operation = ', operation);
            console.log('(AddSurvey) url = ', url);

            let returnedVal = await props.postFunction(postData, operation, url);
            console.log('(AddSurvey) reply received - ', returnedVal?.data?.message)
            
            
            if(returnedVal?.data?.message === "Survey added successfully!" || returnedVal?.data?.message === "survey updated"){
                toast.success("Survey submitted successfully!",{
                    autoClose: 2000
                })
                setTimeout(() => {
                    navigate('/viewSurvey')
                }, 2500);

                return true;
            }
            else{
                toast.error("Error submitting survey!",{
                    autoClose: 2000
                })
            }
        } catch(error){
            console.log('Error adding survey: ', error);
        }
        
    }


  return (
    <>
        <CategorySurveyInput data={fetchedSurveyData} updatingFunction = {handleCategorySurvey} />
        <QuestionInput data = {surveyInfo} buttonRendering = {buttonRendering} updatingFunction = {handleQuestionSubmit}/>
        <ToastContainer />
        
    </>
  );
}

export default UpdatedComponent(AddSurvey);