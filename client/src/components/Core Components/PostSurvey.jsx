import React from 'react'
import axios from 'axios';
import PostSurveyCSS from './css/PostSurveyStyling.module.css'

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../Context/LoginContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UpdatedComponent from './withFetchedData';
import CategorySurveyDropdown from '../Reusable Components/CategorySurveyDropdown';

function PostSurvey(props) {

    const fetchedSurveyData = props.data;

    const {setShowEditButton} = useContext(LoginContext);

    // const [fetchedSurveyData, setfetchedSurveyData] = useState([])

    const [inputSurveyData, setInputSurveyData] = useState({
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
        if(!inputSurveyData.to || inputSurveyData.to.trim() === ''){
            setErrors("Please enter 'To'!")
        }
        
        // check if subject is enetered
        else if(!inputSurveyData.subject || inputSurveyData.subject.trim() === ''){
            setErrors("Please enter subject")
        }
        else{
            setInputSurveyData({...inputSurveyData, category_name: inputSurveyData.category_name, survey_name: inputSurveyData.survey_name})
            const localAPI = await axios.post('http://localhost:4000/survey-api/sendEmail', inputSurveyData, {
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

        setInputSurveyData({...inputSurveyData, [name]: value});
    }

    function handleCategorySurvey(dataPassed) {
        console.log('(ViewSurvey) dataReceived - ', dataPassed);

        setInputSurveyData({...inputSurveyData, ...dataPassed});
    }

    return (
        <>
            <CategorySurveyDropdown data={fetchedSurveyData} updatingFunction={handleCategorySurvey} />
            <div className={PostSurveyCSS.containerStyle}>
            {
                inputSurveyData.survey_name && (

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
                        
                        <p className='form-control input-lg'>Hello, here's your link to take the survey - <br/><Link to={`/takeSurvey/${inputSurveyData.category_name}/${inputSurveyData.survey_name}`}>Take Survey<br/><br/><br/></Link></p>

                        {errors.length!==0 && <p className='fs-6 text-center text-danger'>{errors}</p>}

                        <button className={PostSurveyCSS.functionalBtns} type='submit'>Send</button>
                    </div>
                </form>
            
                </div>
                )
            }
            </div>
            <ToastContainer />
        </>
    )
}

export default UpdatedComponent(PostSurvey);