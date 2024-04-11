import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import ViewSurveyCSS from './css/ViewSurveyStyling.module.css'


export default function BiewSurvey(){

    const [fetchedSurveyData, setFetchedSurveyData] = useState([]);

    const [inputSurveyData, setInputSurveyData] = useState({
        currentQueIndex: 0,
    });

    const [optionSelected, setOptionSelected] = useState({})

    useEffect(() => {
        axios.get('http://localhost:4000/survey-api/surveys', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => setFetchedSurveyData(response.data.payload || []))
            .catch(error => console.log("Error fetching data : ", error))
    }, [])

    console.log('fetched Data - ', fetchedSurveyData);

    // event handler function for inputSurveyData
    function handleChange(event){
        let name = event.target.name;
        let value = event.target.value;

        setInputSurveyData({...inputSurveyData, [name]: value});
    }

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

        // console.log('question edited, index - ', index)
        // console.log('question edited, new text - ', new_text)

        // console.log('inside Edit - ',
        if(name === 'question'){
            fetchedSurveyData.filter(category => category.category_name === inputSurveyData.category_name)
            .map(categoryItem => categoryItem.surveys.filter(survey => survey.survey_name === inputSurveyData.survey_name)
            .map(surveyItem => surveyItem.questions.filter(question => question.id === que_index)
            .map(questionItem => questionItem.text = new_text)
            ))
        }
        // )

        if(name === 'option'){
            // console.log('inside edit 2 - ', 
            fetchedSurveyData.filter(category => category.category_name === inputSurveyData.category_name)
            .map(categoryItem => categoryItem.surveys.filter(survey => survey.survey_name === inputSurveyData.survey_name)
            .map(surveyItem => surveyItem.questions.filter(question => question.id === que_index)
            .map(question => question.options.splice(opt_index, 1, new_text))
            )
            )
            // )
        }
    }

    async function handleSubmitEdit(event){
        event.preventDefault();
        console.log('before submission : ', fetchedSurveyData);
        try{
            const localAPI = await axios.put('http://localhost:4000/survey-api/replaceSurvey', fetchedSurveyData, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            if(localAPI.data.message === 'survey updated'){
                console.log('survey updated successfully!')
            }
            else if(localAPI.data.message === 'survey not updated'){
                console.log('Unable to edit!')
            }
        }
        catch(err){
            console.log('error encountered - ', err)
        }
    }

    // console.log('input Data - ', inputSurveyData);

    // console.log('option Data - ', optionSelected);

    // console.log('updated Data - ', fetchedSurveyData);

    return(
        <>
            <div className={ViewSurveyCSS.viewSurvey}>
                <div className={ViewSurveyCSS.containerStyle}>
                    <div className={ViewSurveyCSS.rowStyle}>
                        <div className={ViewSurveyCSS.dropdownStyle}>
                            <div className={ViewSurveyCSS.colWidth45}>
                                
                                <select id='category' className='form-select' value={inputSurveyData.category_name} name='category_name' onChange={(event) => {handleChange(event); handleOptionSelected(event);}}>
                                    <option value=''>Select Category</option>
                                    {
                                        fetchedSurveyData.map(data => (
                                            <option key={data._id} value={data.category_name}>{data.category_name}</option>
                                        ))
                                    }
                                
                                </select>

                            </div>
                            {
                                optionSelected.category_name && (

                                    <div className={ViewSurveyCSS.colWidth45}>

                                        <select id='survey' className='form-select' name='survey_name' value={inputSurveyData.survey_name} onChange={(event) => {handleChange(event); handleOptionSelected(event);}}>
                                            <option value=''>Select Survey</option>
                                            {
                                                fetchedSurveyData.filter((data) => data.category_name === inputSurveyData.category_name)
                                                    .map(data => data.surveys.map(survey => 
                                                        <option key={survey._id} value={survey.survey_name}>{survey.survey_name}</option>
                                                    ))
                                            }
                                        </select>

                                    </div>
                                )
                            }
                        </div>
                    </div>

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
                                                (inputSurveyData.currentQueIndex < survey.questions.length - 1) && !optionSelected.editBtn && !optionSelected.submitEditBtn &&
                                                <button className={ViewSurveyCSS.functionalBtns} name='next' onClick={handleQuestionChange}>Next</button>
                                            }
                                            {
                                                (inputSurveyData.currentQueIndex >= 1) && !optionSelected.editBtn && !optionSelected.submitEditBtn &&
                                                <button className={ViewSurveyCSS.functionalBtns} name='prev' onClick={handleQuestionChange}>Prev</button>
                                            }
                                            {
                                                (!optionSelected.editBtn && !optionSelected.submitEditBtn)&&
                                                <button className={ViewSurveyCSS.functionalBtns} name='editBtn' onClick={handleOptionSelected}>Edit</button>
                                            }
                                            {
                                                (optionSelected.editBtn) &&
                                                <button className={ViewSurveyCSS.functionalBtns} name='submitEditBtn' onClick={(event) => {handleOptionSelected(event); handleSubmitEdit(event);}}>Submit Edit</button>
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
            </div>
        </>
    )
}