import React, { useEffect, useState } from "react";
import TakeSurveyCSS from '../Core Components/css/TakeSurveyStyling.module.css';
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function TakeSurvey2() {

    const {categoryName, surveyName} = useParams();

    const [userInfo, setUserInfo] = useState({});

    const [fetchedSurveyData, setFetchedSurveyData] = useState([]);

    const [buttonRendering, setButtonRendering] = useState({
        user_info_submitted: false
    })

    const [inputSurveyData, setInputSurveyData] = useState({
        current_que_index: 0,
    })

    const [errors, setErrors] = useState("");

    const [surveyData, setSurveyData] = useState({
        answers:[]
    });

    useEffect(() => {
        axios.get('http://localhost:4000/survey-api/public')
            .then(response => setFetchedSurveyData(response.data.payload || []))
            .catch(error => setErrors(error));
    }, [])

    function handleInfoChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        let newVal = {
            ...userInfo,
            [name] : value,
        }

        setUserInfo(newVal);
    }

    function handleInfoSubmit(event) {

        // check if user entered name, email, id
        if(!userInfo.name || userInfo.name.trim() === ""){
            setErrors('Please enter name!')
        }
        else if(!userInfo.email || userInfo.email.trim() === ""){
            setErrors('Please eneter email!')
        }
        else if(!userInfo.id || userInfo.id.trim() === ""){
            setErrors('Please enter id!')
        }

        else{
            
            let name = event.target.name;
            let newVal = {
                ...buttonRendering,
                [name] : true,
            }

            setErrors("");
            setButtonRendering(newVal);
        }
    }

    function handleOptionChange(event){
        let name = event.target.name;
        let value = event.target.value;

        let newVal = {
            ...inputSurveyData,
            [name] : value,
        }

        setInputSurveyData(newVal);
    }

    function handleCheckboxChange(event){
        let name = event.target.name;
        let value = event.target.value;
        
        // let checkboxSelect = [...inputSurveyData.user_input, value];

        let newVal = {
            ...inputSurveyData,
           // [name] : checkboxSelect,
        }

        if(event.target.checked){
            newVal[name] = [...(newVal[name] || []), value];
        }
        else{
            newVal[name] = (newVal[name] || []).filter(val => val !== value);
        }

        setInputSurveyData(newVal);
    }

    function handleOptionSubmit(event, currentSurveyItem){
        event.preventDefault();

        setSurveyData({
            ...surveyData,
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            category_name: categoryName,
            survey_name: surveyName,
            answers: [
              ...surveyData.answers,
              {
                question: currentSurveyItem.questions[inputSurveyData.current_que_index].text,
                answer: inputSurveyData.user_input,
              },
            ]
          })

        setInputSurveyData({...inputSurveyData, user_input: []})
        setButtonRendering({...buttonRendering, next_que_pressed: true});
    }

    function handleNextQuestion(event){
        event.preventDefault();
    
        setButtonRendering({...buttonRendering, next_que_pressed: false});

        setInputSurveyData({...inputSurveyData, current_que_index: inputSurveyData.current_que_index + 1})
    
    }

    function handleSubmitSurvey(event){
        event.preventDefault();

        try{
            axios.post('http://localhost:4000/response-api/response', surveyData)
                .then(
                    toast.success('Submitted Successfully!', { autoClose: 2000 })
                )
        }
        catch(error){
            setErrors(error);
            console.log('Error adding survey: ', error);
        }
        
    }

    // console.log('(TakeSurvey2) userInfo - ', userInfo);
    // console.log('(TakeSurvey2) fetchedSurveyData - ', fetchedSurveyData);
    console.log('(TakeSurvey2) inputSurveyData - ', inputSurveyData);
    console.log('(TakeSurvey2) surveyData - ', surveyData);

    return(
        <>
            <div className={TakeSurveyCSS.takeSurvey}>
                <div className={TakeSurveyCSS.containerStyle}>
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
                            !buttonRendering.user_info_submitted ? (
                            
                                <div className={TakeSurveyCSS.rowStyle}>
                                    <button name="user_info_submitted" type='button' className={TakeSurveyCSS.functionalBtns} onClick={handleInfoSubmit}>Submit</button>
                                </div>

                            ) : (

                                <div className={TakeSurveyCSS.rowStyle}>
                                {
                                    fetchedSurveyData.filter(data => data.category_name === categoryName)
                                    .map(category => category.surveys.filter(surveyItem => surveyItem.survey_name === surveyName)
                                    .map(survey => 

                                        survey.questions.slice(inputSurveyData.current_que_index, inputSurveyData.current_que_index+1).map(question => (
                                            
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
                                                {
                                                    question.type === 'text' && (
                                                        <input
                                                            className='form-control'
                                                            type='text'
                                                            name='user_input'
                                                            onChange={handleOptionChange}
                                                        />
                                                    )
                                                }
                                                {
                                                    question.options.map((option, index) => (
                                                        <div className={TakeSurveyCSS.colWidth90} key={index}>
                                                            <div className={TakeSurveyCSS.colWidth10}>
                                                            {
                                                                question.type === 'radio' && (
                                                                    <input
                                                                        className='form-check-input'
                                                                        type={question.type}
                                                                        name='user_input'
                                                                        value={option}
                                                                        onChange={handleOptionChange}
                                                                    />
                                                                )
                                                            }
                                                            {
                                                                question.type === 'checkbox' && (
                                                                    <input
                                                                        className='form-check-input'
                                                                        type={question.type}
                                                                        name='user_input'
                                                                        value={option}
                                                                        onChange={handleCheckboxChange}
                                                                    />
                                                                )
                                                            }
                                                            </div>
                                                            <label
                                                                className='form-label'
                                                                htmlFor={`option${index + 1}`}
                                                            >
                                                                {option}
                                                            </label>
                                                        </div>
                                                    ))
                                                }
                                                </div>
                                                {
                                                    !buttonRendering.next_que_pressed ? (
                            
                                                        <button type='button' className={TakeSurveyCSS.functionalBtns} 
                                                        onClick={(event) => handleOptionSubmit(event, survey)}
                                                        >Submit</button>
                        
                                                    ) : (undefined)
                                                }
                                                {
                                                    (inputSurveyData.current_que_index < survey.questions.length - 1 && buttonRendering.next_que_pressed) && (

                                                        <button name="next_que_pressed" className={TakeSurveyCSS.functionalBtns} 
                                                        onClick={handleNextQuestion}
                                                        >Next</button>

                                                    )
                                                }
                                                {
                                                    (inputSurveyData.current_que_index === survey.questions.length - 1 && buttonRendering.next_que_pressed) && (

                                                        <button className={TakeSurveyCSS.functionalBtns} type='button' 
                                                        onClick={(event) => handleSubmitSurvey(event)}
                                                        >Done</button>

                                                    )
                                                }
                                            </div>
                                        ))
                                        
                                    ))
                                }
                                </div>

                            )
                        }
                    </form>
                    {errors?.length !== 0 && <p className='fs-6 text-center text-danger'>{errors}</p> }
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default TakeSurvey2;