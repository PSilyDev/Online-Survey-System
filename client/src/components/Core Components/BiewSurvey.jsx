import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import ViewSurveyCSS from './css/ViewSurveyStyling.module.css'


export default function BiewSurvey(){

    const [fetchedSurveyData, setFetchedSurveyData] = useState([]);

    const [inputSurveyData, setInputSurveyData] = useState({});

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

    console.log('input Data - ', inputSurveyData);

    console.log('option Data - ', optionSelected);

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
                                
                                fetchedSurveyData.filter(data => data.category_name === inputSurveyData.category_name) 
                                .map(category => category.surveys.filter(surveyItem => surveyItem.survey_name === inputSurveyData.survey_name))

                                
                                // ALTERNATE - 
                                //     fetchedSurveyData.find(data => data.category_name === inputSurveyData.category_name) // return an object where the category_name matches
                                //         .surveys.find(data => data.survey_name === inputSurveyData.survey_name) // in the surveys property of the object, find the survey where survey_name matches and return that object
                                
                                
                                  
                            }
                        </div>
                    )
                }
                </div>
            </div>
        </>
    )
}