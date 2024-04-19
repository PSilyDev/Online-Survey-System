import React from 'react'
import axios from 'axios';
import PostSurveyCSS from './css/PostSurveyStyling.module.css'

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../Context/LoginContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UpdatedComponent from './withFetchedData';

function PostSurvey(props) {

    const fetchedData = props.data;

    const {setShowEditButton} = useContext(LoginContext);

    // const [fetchedData, setFetchedData] = useState([])

    const [inputValues, setInputValues] = useState({
        category_name:'',
        survey_name: '',
        to:'',
        subject: '',
    })

    const [errors, setErrors] = useState('')

    useEffect(() => {
        setShowEditButton(true);
    })

    async function handleEmailSubmit(event){
        event.preventDefault();

        // check if to is enetered
        if(!inputValues.to || inputValues.to.trim() === ''){
            setErrors("Please enter 'To'!")
        }
        
        // check if subject is enetered
        else if(!inputValues.subject || inputValues.subject.trim() === ''){
            setErrors("Please enter subject")
        }
        else{
            setInputValues({...inputValues, category_name: inputValues.category_name, survey_name: inputValues.survey_name})
            const localAPI = await axios.post('http://localhost:4000/survey-api/sendEmail', inputValues, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

            if(localAPI.data.payload === 'Email sent successfully!'){
                toast.success("Email sent successfully!", {
                    autoClose: 2000,
                });
            }
            else{
                toast.success("Error occurred!", {
                    autoClose: 2000,
                });
            }
        }
    }

    function handleChange(event){
        let name = event.target.name;
        let value = event.target.value;

        setInputValues({...inputValues, [name]: value});
    }

    return (
        <>
            {/* selecting the category fetched from the DB */}
            <div className={PostSurveyCSS.postSurvey}>
            <div className={PostSurveyCSS.containerStyle}>
                <div className={PostSurveyCSS.rowStyle}>
                    <div className={PostSurveyCSS.dropdownStyle}>

                        {/* category name */}
                        <div className={PostSurveyCSS.colWidth45}>
                            <select name='category_name' className='form-select' value={inputValues.category_name} required onChange={handleChange}>
                                <option value=''>Select Category</option>
                                {
                                    // hanndleChange event triggered when user slects the category
                                    fetchedData.map(data => (
                                    <option key={data._id} value={data.category_name}>{data.category_name}</option>
                                    ))
                                }
                            </select>
                        </div>
                
                        {
                        // if the category selected render survey dropdown
                        inputValues.category_name && (
                        <>

                            {/* survey name */}
                            <div className={PostSurveyCSS.colWidth45}>
                                    <select name='survey_name' className='form-select' value={inputValues.survey_name} required onChange={handleChange}>
                                        <option value="">Select Survey</option>
                                        {
                                            fetchedData.filter(data => (data.category_name === inputValues.category_name))
                                            .map(data => data.surveys.map(survey => 
                                                <option key={survey.survey_name} value={survey.survey_name}>{survey.survey_name}</option>
                                            ))
                                            // handleChange triggered when user selects the survey from the dropdown
                                        }
                                    </select>
                            </div>
                        </>
                        )
                        }
                    </div>
                </div>
                {
                    inputValues.survey_name && (

                    <div className={PostSurveyCSS.emailStyle}>
                    <form onSubmit={handleEmailSubmit}>
                        <div className={PostSurveyCSS.colWidth75}>

                            <label htmlFor='to' className='form-label'>To</label>
                            {/* for taking email input */}
                            <input
                                type='text'
                                className='form-control'
                                name='to'
                                onChange={handleChange}
                            />
                        

                            <label htmlFor='subject' className='form-label'>Subject</label>
                            {/* for taking email input */}
                            <input 
                                type='text'
                                className='form-control'
                                name='subject'
                                onChange={handleChange}
                            />

                            <label htmlFor='content' className='form-label'>Content</label>
                            {/* body content containing the dynamic link */}
                            
                            <p className='form-control input-lg'>Hello, here's your link to take the survey - <br/><Link to={`/takeSurvey/${inputValues.category_name}/${inputValues.survey_name}`}>Take Survey<br/><br/><br/></Link></p>

                            {errors.length!==0 && <p className='fs-6 text-center text-danger'>{errors}</p>}

                            <button className={PostSurveyCSS.functionalBtns} type='submit'>Send</button>
                        </div>
                    </form>
                
                    </div>
                    )
                }
            </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default UpdatedComponent(PostSurvey);