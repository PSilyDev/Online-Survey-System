import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import './css/PostSurveyStyling.css'
import PostSurveyCSS from './css/PostSurveyStyling.module.css'
// import VerifyToken, {authUser} from '../../VerifyToken';
import { LoginContext } from '../../Context/LoginContext';
import { useNavigate} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function PostSurvey() {

    const navigate = useNavigate();

    // VerifyToken();
    const {userData, setUserData, setShowProfile, setShowEditButton} = useContext(LoginContext);

    const [fetchedData, setFetchedData] = useState([])

    const [inputValues, setInputValues] = useState({
        category_name:'',
        survey_name: '',
        to:'',
        subject: '',
        // link:''
    })

    const [errors, setErrors] = useState('')

    console.log('inputValues - ', inputValues);

    


    //fetching all the categoeries from json-server
    useEffect(() => {
        setShowEditButton(true);
        axios.get('http://localhost:4000/survey-api/surveys', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => setFetchedData(response.data.payload || []))
        .catch(error => console.log('Error fetching categories : ', error));
    
    
    // let abc = VerifyToken();
    // console.log('abc - ', abc);
}, []);

// async function fetchSurveyData() {
//     try{
        
//         const response = await axios.get('http://localhost:4000/survey-api/surveys', {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         });
//         console.log('pointer 2 : response receieved from get request - ', response.data)
//         setFetchedData(response.data.payload || [])
//     }
//     catch(error){
//         console.log('Error fetching survey data : ', error);
//     }
// }

    // console.log('fetched data categories - ', fetchedData);
   

    async function handleEmailSubmit(event){
        event.preventDefault();

        // check if to is enetered
        if(!inputValues.to || inputValues.to.trim() === ''){
            setErrors("Please enter 'To'!")
        }
        else if(!inputValues.subject || inputValues.subject.trim() === ''){
            setErrors("Please enter subject")
        }
        else{
            const takeSurveyLink = `/takeSurvey/${inputValues.category_name}/${inputValues.survey_name}`;
            setInputValues({...inputValues, category_name: inputValues.category_name, survey_name: inputValues.survey_name})
            const localAPI = await axios.post('http://localhost:4000/survey-api/sendEmail', inputValues, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

            console.log('response receieved - ', localAPI);
            // alert('Email sent successfully!')
        }
    }

    //generating dynamic link that needs to posted to end users
    

    function handleChange(event){
        let name = event.target.name;
        let value = event.target.value;

        setInputValues({...inputValues, [name]: value});
    }

   
    
  return (
    <>
        {/* selecting the category fetched from the json server */}
        <div className={PostSurveyCSS.postSurvey}>
        <div className={PostSurveyCSS.containerStyle}>
            <div className={PostSurveyCSS.rowStyle}>
                <div className={PostSurveyCSS.dropdownStyle}>
                    <div className={PostSurveyCSS.colWidth45}>
                        {/* <label htmlFor="category">Select Category: </label> */}
                        <select name='category_name' className='form-select' value={inputValues.category_name} required onChange={handleChange}>
                            <option value=''>Select Category</option>
                            {
                                // hanndleCategoryChange event triggered when user slects the category
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
                        <div className={PostSurveyCSS.colWidth45}>
                            {/* <label htmlFor="category">Select Category: </label> */}
                                <select name='survey_name' className='form-select' value={inputValues.survey_name} required onChange={handleChange}>
                                    <option value="">Select Survey</option>
                                    {
                                        fetchedData.filter(data => (data.category_name === inputValues.category_name))
                                        .map(data => data.surveys.map(survey => 
                                            <option key={survey.survey_name} value={survey.survey_name}>{survey.survey_name}</option>
                                        ))
                                        // handleSurveyChange triggered when user selects the survey from the dropdown
                                        // fetchedData[inputValues.category_name].map(item => (
                                        //     item.surveys.map(survey => 
                                        //     <option key={survey.survey_name} value={survey.survey_name}>{survey.survey_name}</option>
                                        // ))
                                        // )
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
                            // required
                            onChange={handleChange}
                        />
                    

                        <label htmlFor='subject' className='form-label'>Subject</label>
                        {/* for taking email input */}
                        <input 
                            type='text'
                            className='form-control'
                            name='subject'
                            // required
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
    </>
  )
}

export default PostSurvey