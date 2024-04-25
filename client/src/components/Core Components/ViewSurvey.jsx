import React, { useState } from 'react';
import axios from 'axios';
import ViewSurveyCSS from './css/ViewSurveyStyling.module.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

import UpdatedComponent from './withFetchedData';
import CategorySurveyDropdown from '../Reusable Components/CategorySurveyDropdown';


function ViewSurvey(props){

    const navigate = useNavigate();

    const fetchedSurveyData = props.data;
    console.log('(ViewSurvey) fetchedSurveyData - ', fetchedSurveyData);
    // const [fetchedSurveyData, setFetchedSurveyData] = useState([]);

    const [inputSurveyData, setInputSurveyData] = useState({
        currentQueIndex: 0,
    });

    const [optionSelected, setOptionSelected] = useState({})


    function handleOptionSelected(event){
        let name = event.target.name;
        

        setOptionSelected({...optionSelected, [name]: true});

    }

    function handleQuestionChange(event){
        event.target.name === 'next' ?
        setInputSurveyData({...inputSurveyData, currentQueIndex: inputSurveyData.currentQueIndex+1}) :
        setInputSurveyData({...inputSurveyData, currentQueIndex: inputSurveyData.currentQueIndex-1})

    }

    function handleEdit(event, que_index, opt_index){
        let name = event.target.name
        let new_text = event.target.value;

        if(name === 'question'){
            fetchedSurveyData.filter(category => category.category_name === inputSurveyData.category_name)
            .map(categoryItem => categoryItem.surveys.filter(survey => survey.survey_name === inputSurveyData.survey_name)
            .map(surveyItem => surveyItem.questions.filter(question => question.id === que_index)
            .map(questionItem => questionItem.text = new_text)
            ))
        }

        if(name === 'option'){
            fetchedSurveyData.filter(category => category.category_name === inputSurveyData.category_name)
            .map(categoryItem => categoryItem.surveys.filter(survey => survey.survey_name === inputSurveyData.survey_name)
            .map(surveyItem => surveyItem.questions.filter(question => question.id === que_index)
            .map(question => question.options.splice(opt_index, 1, new_text))
            )
            )
        }
    }

    function handleButtons(event){
        let name = event.target.name;
        if(name === 'submitEditBtn'){
            setOptionSelected({...optionSelected, editBtn: false});
        }

        if(name === 'editBtn'){
            setOptionSelected({...optionSelected, finalSubmitBtn: true});
        }

    }

    async function handleSubmit(event){
        event.preventDefault();
        console.log('before submission : ', fetchedSurveyData[inputSurveyData.category_index-1]);
        // setOptionSelected({...optionSelected, editBtn: false});

        let postData = fetchedSurveyData[inputSurveyData.category_index-1];
        let operation = 'put';
        let url = 'http://localhost:4000/survey-api/replaceSurvey';

        try{

            let returnedVal = await props.postFunction(postData, operation, url);
            console.log('(ViewSurvey) reply received - ', returnedVal?.data?.message);
            if(returnedVal?.data?.message === 'survey updated'){
                toast.success('Updated Successfully!', {autoClose: 2000})
                setTimeout(() => {
                    navigate('/postSurvey')
                }, 2500)
                console.log('survey updated successfully!')
            }
            else if(returnedVal?.data?.message === 'survey not updated'){
                console.log('Unable to edit!')
            }
        }
        catch(err){
            console.log('Error encountered - ', err);
        }

    }


    function handleCategorySurvey(dataPassed) {
        // console.log('(ViewSurvey) dataReceived - ', dataPassed);

        setInputSurveyData({...inputSurveyData, ...dataPassed});
        setOptionSelected({...optionSelected, survey_name: true});
    }



    return(
        <>
            <CategorySurveyDropdown data={fetchedSurveyData} updatingFunction={handleCategorySurvey} />
            <div className={ViewSurveyCSS.containerStyle}>
            {
                optionSelected.survey_name && (

                    <div>
                        {
                                // ALTERNATE - 
                            //     fetchedSurveyData.find(data => data.category_name === inputSurveyData.category_name) // return an object where the category_name matches
                            //         .surveys.find(data => data.survey_name === inputSurveyData.survey_name) // in the surveys property of the object, find the survey where survey_name matches and return that object

                            fetchedSurveyData.filter(data => data.category_name === inputSurveyData.category_name) 
                            .map(category => category.surveys.filter(surveyItem => surveyItem.survey_name === inputSurveyData.survey_name)
                            .map(survey => ( 
                                
                                <div key={survey._id}>

                                    <form>
                                        {survey.questions.slice(inputSurveyData.currentQueIndex, inputSurveyData.currentQueIndex + 1).map(question => (

                                            <div className={ViewSurveyCSS.rowStyle} key={question.id}>
                                                <div className={ViewSurveyCSS.colWidth75}>

                                                    <label htmlFor='question'>Question - {question.id}</label>
                                                    <input
                                                        type='text'
                                                        defaultValue={question.text}
                                                        name='question'
                                                        onChange={(event) => handleEdit(event, question.id, -1)}
                                                        readOnly={!optionSelected.editBtn}
                                                    />

                                                </div>

                                                <div className='row-style'>

                                                {
                                                    question.options.map((option, index) => (
                                                        <div className={ViewSurveyCSS.colWidth75} key={index}>

                                                            <input
                                                                type='text'
                                                                name='option'
                                                                defaultValue={option}
                                                                onChange={(event) => handleEdit(event, question.id, index)}
                                                                readOnly={!optionSelected.editBtn}
                                                            />

                                                        </div>
                                                    ))
                                                }

                                                </div>

                                            </div>

                                        ))}
                                    </form>

                                    <div className='row-style'>
                                        {

                                            (inputSurveyData.currentQueIndex < survey.questions.length - 1 && !optionSelected.editBtn) &&
                                            <button className={ViewSurveyCSS.functionalBtns} name='next' onClick={(event) => {handleButtons(event); handleQuestionChange(event)}}>Next</button>
                                        }
                                        {
                                            (inputSurveyData.currentQueIndex >= 1 && !optionSelected.editBtn) && 
                                            <button className={ViewSurveyCSS.functionalBtns} name='prev' onClick={handleQuestionChange}>Prev</button>
                                        }
                                        {
                                            (!optionSelected.editBtn) &&
                                            <button className={ViewSurveyCSS.functionalBtns} name='editBtn' onClick={(event) => {handleButtons(event);handleOptionSelected(event)}}>Edit</button>
                                        }
                                        {
                                            (optionSelected.editBtn?true:false && optionSelected.editBtn) &&
                                            <button className={ViewSurveyCSS.functionalBtns} name='submitEditBtn' onClick={(event) => {handleOptionSelected(event); handleButtons(event);}}>Submit Edit</button>
                                            
                                        }
                                        {
                                            // (inputSurveyData.currentQueIndex === survey.questions.length-1 || optionSelected.finalSubmitBtn?true: false) && optionSelected.finalSubmitBtn &&
                                            (inputSurveyData.currentQueIndex === survey.questions.length-1) && !optionSelected.editBtn &&
                                            <button className={ViewSurveyCSS.functionalBtns} name='finalSubmitBtn' onClick={(event) => {handleOptionSelected(event); handleSubmit(event);}}>Submit</button>
                                        }
                                    </div>

                                </div>
                                ))
                            )
                                
                        }
                    </div>
                )
            }
            </div>
            
            <ToastContainer />
        </>
    )
}

export default UpdatedComponent(ViewSurvey);