import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom/dist';
import AddSurveyCSS from './css/AddSurveyStyling.module.css';
import { LoginContext } from '../../Context/LoginContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import UpdatedComponent from './withFetchedData';


function AddSurvey({name}) {

    const {setShowEditButton} = useContext(LoginContext);

    const navigate = useNavigate();

    const [surveyInfo, setSurveyInfo] = useState({
        surveys: []
    })//storing surveyData that is to be put, post on json-server/DB

    //for storing fetched data from storeQuestionDB.json/DB
    const [fetchedSurveyData, setFetchedSurveyData] = useState([]);
    
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
        add_que_pressed : false,
        show_new_que: false
    })

    
    useEffect(() => {
        // if user did not edit profile and directly moved to another component
        setShowEditButton(true);

        try{
            // get survey data from DB and store in fetchedSurveyData
            axios.get('http://localhost:4000/survey-api/surveys', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => setFetchedSurveyData(response.data.payload || []))
            .catch(error => console.log('Error fetching categories : ', error));
        }
        catch(error){
            console.log('Error fetching survey data : ', error);
        }
    }, [])

    

    // Note - we are taking categoryNameValue because we have to first validate whether category, survey exists and then store in surveyInfo\
    
    //once the user enters the Category, Survey Name, he'll press submit whcich will trgger this event
    function handleCategoryNameSubmit(event){
        event.preventDefault();

        //check if the user pressed the submit button without entering the Category, Survey Name
        if(!inputSurveyData.category_name || inputSurveyData.category_name.trim() === ""){
            setErrors('Please enter category');

           setButtonRendering({...buttonRendering, category_survey_name_submitted : false});
        }
        else if(!inputSurveyData.survey_name || inputSurveyData.survey_name.trim() === ""){
            setErrors('Please enter survey name');

            setButtonRendering({...buttonRendering, category_survey_name_submitted : false});
        }
        else if(Object.keys(inputSurveyData).length === 0){            
            setErrors('Please enter Category and Survey name');
            
            //setCategoryNameSubmit to false so that we don't render the next set of inputs
            setButtonRendering({...buttonRendering, category_survey_name_submitted : false});
        }

        //else user entered the Category, Survey Name
        else{
            //flag is for checking whether the Category, Survey Name already present in the storeQuestionDB.json

            //flag = 2 represnt that Category, Survey Name is uniques and not present in DB
            let flagVal = 2;
            let categoryId = '';
            let matchFound = false;

            //fetchedSurveyData has all the data fetched from the json-server
            fetchedSurveyData.forEach(data => {
                data.surveys.forEach(category => {
                
                    //check if category exists
                    if(data.category_name === inputSurveyData.category_name){
                        if(category.survey_name === inputSurveyData.survey_name){
                        flagVal = 0;
                        // console.log('category, survey name already present');
                        matchFound = true;
                        
                    }
                    else if(!matchFound){
                        //only category exists
                        flagVal = 1;

                        //we'll store the id of that category
                        categoryId = data._id;
                        // console.log('only category exists!')

                    }
                }     
                });
                if(matchFound) return;
            });

            //updating state based on flag value
            //updating state with category ID, if found duplicate
            setInputSurveyData({...inputSurveyData, "dupCategoryId": categoryId, "flag": flagVal});

            if(flagVal === 0){
                // console.log('category, name both exist!!!');
                setErrors('category, name both exist!!!');
            }

            else if(flagVal === 1){
                setErrors('category already exists, adding a new survey within the same category')
                // console.log('only category exists');

                //we'll only store the survey information in the surveyInfo state
                setSurveyInfo(prevSurveyInfo => ({
                    ...prevSurveyInfo,
                    surveys: [
                        ...prevSurveyInfo.surveys,
                        {
                            survey_name: inputSurveyData.survey_name,
                            questions: [],
                        },
                    ],
                }));

                //categoryName Button is submitted
                setButtonRendering({...buttonRendering, category_survey_name_submitted : true});
                
            }

            else if(flagVal === 2){
                // console.log('nothing exists!!!');

                setButtonRendering({...buttonRendering, category_survey_name_submitted : true});
                
                setSurveyInfo((prevSurveyInfo) => ({
                    
                    category_name: inputSurveyData.category_name,
                    surveys: [
                        {  
                            survey_name: inputSurveyData.survey_name,
                        },
                    ],
                }));
            }
        }

    }
    

    //simple event function for capturing input field text enetered by the user
    function handleOptionValue(index, event){
        let name = event.target.name;
        let value = event.target.value;

        let data = [...inputSurveyData.options];
        data[index][name] = value;

        //stroing the option values in optionValues state
        setInputSurveyData({...inputSurveyData, "options": data})
    }

    function addOptions(){
        let newOption = {}

        setInputSurveyData({...inputSurveyData, "options": [...inputSurveyData.options, newOption]})
    }

    function removeOption(index) {

        let data = [...inputSurveyData.options]
        data.splice(index, 1);
        setInputSurveyData({...inputSurveyData, "options": data});
    }

    //event function when the user enters the questions and the options and presses the Add Question button
    function handleAddQuestion(event){
       
        //firstly check if the user has enetered a question or not?
        if(!inputSurveyData['question_text'] || inputSurveyData['question_text'].trim() === ''){
        setErrors('Please add question value]')
        }

        //check if user has selected the question type or not?
        else if(!inputSurveyData.question_type || inputSurveyData.question_type === 'Select Type'){
            setErrors('Please select question type')
        }

        else{
            let checkEmptyOption = false;
            for(let obj of inputSurveyData.options){        
                if(Object.keys(obj).length === 0){
                    checkEmptyOption = true;
                }
                for(let key in obj){
                    if(obj[key] === ''){
                        checkEmptyOption = true;
                    }
                }
                
            }
            //check if there's an empty value in options
            if(checkEmptyOption && inputSurveyData.question_type !== 'text'){
                setErrors('Please enter value in option')
            }

            //check if user has enetered option or not?
            else if(Object.keys(inputSurveyData.options).length <= 1 && inputSurveyData.question_type !== 'text'){
                setErrors('Please enter at least two options')
            }


            else{
                //get all the options from the optionValue state in the form of array
                const optionsArray = Object.values(inputSurveyData.options);
                
                
                //updating the surveyInfo state that is to posted in the json-server
                setSurveyInfo((prevSurveyInfo) => {
                    const newQuestion = {
                        // counter state is updating for each question
                        id: String(inputSurveyData.counter),
                        text: inputSurveyData.question_text,
                        type: inputSurveyData.question_type,
                        options: optionsArray.map(item => item.option) // return array without 'option'
                    };

                    const updatedSurveys = prevSurveyInfo.surveys.map((survey) => {
                        let updatedQuestions = []
                        if(survey.questions){       //questions already exists
                            updatedQuestions = [...survey.questions, newQuestion]
                        }
                        else{
                            updatedQuestions = [newQuestion]
                        }
                        return{
                            ...survey,
                            questions: updatedQuestions
                        };
                    });

                    return {
                        ...prevSurveyInfo,
                        surveys: updatedSurveys,
                    };
                });

                //set Add Question button pressedd to true
                setButtonRendering({...buttonRendering, add_que_pressed: true})
            }
        }

    };


    function resetState() {
        setErrors();
        setInputSurveyData({...inputSurveyData, 
        counter: inputSurveyData.counter+1,
        question_type: '',
        question_text: '',
        options: [{}]})
        setButtonRendering({...buttonRendering, add_que_pressed: false})
    }
    
    //event handler for when the user presses new question
    function handleNewQuestion() {
        resetState();
    }

    //event function handler when the user submits the form
    async function handleQuestionSubmit(event){
        event.preventDefault();

        try{
            if(inputSurveyData.flag === 2){
                // console.log('neither category nor survey exists!')
                // if flag == 2, we'll be posting the surevyInfo that has the category also
                const localAPI = await axios.post('http://localhost:4000/survey-api/survey', surveyInfo, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            else if(inputSurveyData.flag === 1){
                // console.log('category exists, category - ', fetchedSurveyData.find(category => category._id === inputSurveyData.dupCategoryId)._id)
                // console.log('category exists, surveys - ', [...fetchedSurveyData.find(category => category._id === inputSurveyData.dupCategoryId).surveys, ...surveyInfo.surveys])
                
                // if flag == 1, we'll update the DB using put method
                const localAPI = await axios.put('http://localhost:4000/survey-api/survey', {
                    category_id: fetchedSurveyData.find(category => category._id === inputSurveyData.dupCategoryId)._id,
                    updated_surveys: [...fetchedSurveyData.find(category => category._id === inputSurveyData.dupCategoryId).surveys, ...surveyInfo.surveys],
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            }
            
            // reseting the surveyInfo state
            setSurveyInfo({
                category_name: '',
                surveys: [
                    {
                        survey_name: '',
                        questions: [],
                    },
                ],
            });

            setErrors();

            setButtonRendering({...buttonRendering, add_que_pressed: false})

            setButtonRendering({...buttonRendering, category_survey_name_submitted : false});

            setInputSurveyData({
                category_name: '',
                survey_name: '',
                question_type: '',
                question_text: '',
                options: [{}],
                flag: 2,
                dupCategoryId: '',
                counter: 1

            })
            toast.success("Survey submitted successfully!",{
                autoClose: 2000
            })
            setTimeout(() => {
                navigate('/viewSurvey')
            }, 2500);

        } catch(error){
            console.log('Error adding survey: ', error);
        }
        
    }


    function handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        setInputSurveyData({ ...inputSurveyData, [name]: value});
    }

  return (
    <>
        <div className={AddSurveyCSS.containerStyle}>
            <form onSubmit={handleQuestionSubmit}>
                <div className={AddSurveyCSS.rowStyle}>
                    
                    {/* Category Name */}
                    <div className={AddSurveyCSS.colWidth25}>
                        <label htmlFor='category_name'>Category Name</label>
                    </div>
                    <div className={AddSurveyCSS.colWidth75}>
                        <input 
                            type='text'
                            placeholder='Enter category..'
                            name='category_name'
                            value={inputSurveyData.category_name || ''}
                            readOnly={buttonRendering.category_survey_name_submitted}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className={AddSurveyCSS.rowStyle}>

                    {/* Survey Name */}
                    <div className={AddSurveyCSS.colWidth25}>
                        <label htmlFor='survey_name'>Survey Name</label>
                    </div>
                    <div className={AddSurveyCSS.colWidth75}>
                        <input
                            type='text'
                            placeholder='Enter survey name..'
                            name='survey_name'
                            value={inputSurveyData.survey_name || ''}
                            readOnly={buttonRendering.category_survey_name_submitted}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                {errors?.length!==0 && <p className='fs-6 text-center text-danger'>{errors}</p>}
                
                {
                    
                    !buttonRendering.category_survey_name_submitted?
                    (
                        <div className={AddSurveyCSS.rowStyle}>
                            <button type='button' className={AddSurveyCSS.functionalBtns} onClick={handleCategoryNameSubmit}>Submit</button>
                        </div>
                    ) : 
                    (
                        <>
                            <div className={AddSurveyCSS.rowStyle}>

                                {/* Question */}
                                <div className={AddSurveyCSS.colWidth25}>
                                    <label htmlFor='question_text'>Question {inputSurveyData.counter}</label>
                                </div>
                                <div className={AddSurveyCSS.colWidth75}>
                                    <textarea
                                        name='question_text'
                                        rows='3'
                                        value={inputSurveyData.question_text===undefined?(''):(inputSurveyData.question_text)}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                            </div>

                            {/* Question Type */}
                            <div className={AddSurveyCSS.rowStyle}>
                                <select
                                    value={inputSurveyData.question_type===''?'Select Type':(undefined)}
                                    name='question_type'
                                    className={AddSurveyCSS.selectType}
                                    onChange={handleChange}
                                >
                                    <option>Select Type</option>
                                    <option value='checkbox'>Checkbox</option>
                                    <option value='radio'>Radio Button</option>
                                    <option value='text'>Text Field</option>
                                </select>
                            </div>
                            {
                                // if question type is radio or checkbox
                                (inputSurveyData.question_type === 'radio' || inputSurveyData.question_type === 'checkbox') &&
                                (
                                    <>
                                    {
                                        inputSurveyData.options?.map((input, index) => {
                                            return (
                                                <div key={index} className={AddSurveyCSS.rowStyleOpt}>

                                                    <div className={AddSurveyCSS.colWidth25}>
                                                        <label htmlFor='option'>Option {index+1}</label>
                                                    </div>

                                                    <div className={AddSurveyCSS.colWidth70}>
                                                        <input
                                                            type='text'
                                                            name='option'
                                                            value={input.option || ''}
                                                            onChange={event => handleOptionValue(index, event)}
                                                        />
                                                    </div>
                                                    <div className={AddSurveyCSS.colWidth10}>
                                                        <button type='button' className={AddSurveyCSS.delOption} onClick={() => removeOption(index)}>-</button>
                                                    </div>
                                                    
                                                </div>
                                            )
                                        })
                                        
                                    }
                                    <div className={AddSurveyCSS.colWidth10}>
                                        <button type='button' className={AddSurveyCSS.addOption} onClick={addOptions}>+</button>
                                    </div>
                                    
                                </>
                                )
                            }
                                <div className={AddSurveyCSS.rowStyle}>
                                {/* {errors?.length !== 0 && <p className="fs-6 text-center text-danger">{errors}</p>} */}
                            {
                                !buttonRendering.add_que_pressed &&
                                (
                                    <button type='button' className={AddSurveyCSS.functionalBtns} onClick={handleAddQuestion}>Add Question</button>
                                )
                            }
                            {
                                (!buttonRendering.show_new_que && buttonRendering.add_que_pressed) &&
                                (
                                    <button type='button' className={AddSurveyCSS.functionalBtns} onClick={handleNewQuestion}>New Question</button>
                                )
                            }
                            {
                                (inputSurveyData.counter!==0 && buttonRendering.add_que_pressed) &&
                                (
                                            <button type='submit' className={AddSurveyCSS.functionalBtns}>Submit</button>
                                )
                            }
                            </div>
                        </>
                    )
                }
            </form>
        </div>
        <ToastContainer />
        
    </>
  );
}

export default UpdatedComponent(AddSurvey);