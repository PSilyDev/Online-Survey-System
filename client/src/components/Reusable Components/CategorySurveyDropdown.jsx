import React, { useEffect } from "react";
import { useState } from "react";
import ViewSurveyCSS from '../Core Components/css/ViewSurveyStyling.module.css';

function CategorySurveyDropdown(props) {

    let fetchedSurveyData = props.data;

    const [inputSurveyData, setInputSurveyData] = useState({});

    const [optionSelected, setOptionSelected] = useState({})

    function handleChange(event, index){
        let name = event.target.name;
        let value = event.target.value;

        if(name === 'category_name'){
            let updatedData = {
                ...inputSurveyData,
                "category_index": index,
                [name]: value
            }
            // console.log('index of category - ', index)
            setInputSurveyData(updatedData);
        }
        else{
            setInputSurveyData({...inputSurveyData, [name]: value});
        }
    }

    function handleOptionSelected(event){
        let name = event.target.name;
        

        setOptionSelected({...optionSelected, [name]: true});

        // if(name === 'survey_name'){
        //     setOptionSelected({...optionSelected, [name]: true});
        //     console.log('(CategorySurveyDropdown) data passed - ', inputSurveyData);
        //     props.updatingFunction(inputSurveyData);
        // }

    }

    useEffect(() => {
        if(optionSelected.survey_name){
            console.log('(CategorySurveyDropdown) data passed - ', inputSurveyData);
            props.updatingFunction(inputSurveyData);
        }
    },[optionSelected])

    console.log('(CategorySurveyDropdown) inputSurveyData - ', inputSurveyData);

    return(
        <>
            <div className={ViewSurveyCSS.viewSurvey}>
                <div className={ViewSurveyCSS.containerStyle}>
                    <div className={ViewSurveyCSS.rowStyle}>
                        <div className={ViewSurveyCSS.dropdownStyle}>
                            <div className={ViewSurveyCSS.colWidth45}>
                                
                                <select id='category' className='form-select' value={inputSurveyData.category_name} name='category_name' onChange={(event) => {
                                    const selectedIndex = event.target.selectedIndex;
                                    handleChange(event, selectedIndex); 
                                    handleOptionSelected(event);
                                    }}>
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
                </div>
            </div>  
        </>
    )
}

export default CategorySurveyDropdown;