import React, { useEffect, useState } from "react";
import AddSurveyCSS from '../Core Components/css/AddSurveyStyling.module.css';

function QuestionInput(props){

    console.log('(QuestionInput) buttonRendering - ', props.buttonRendering);
    
    const [surveyInfo, setSurveyInfo] = useState();

    useEffect(() => {
        // if(!surveyInfo){
        //     console.log('surveyInfo is empty')
        //     setSurveyInfo(props.data);
        // }
        setSurveyInfo(props.data);
    }, [props.data])

    // useEffect(() => {
    //     setButtonRendering({...buttonRendering, category_survey_name_submitted: props.buttonRendering.category_survey_name_submitted})
    // }, [props.buttonRendering])

    useEffect(() => {
        console.log('(QuestionInput, useEffect) surveyInfo - ', surveyInfo);
    }, [surveyInfo])

    console.log('(QuestionInput) surveyInfo - ', surveyInfo);
    
    // console.log('(QuestionInput) data received - ', props.data);


    const [inputSurveyData, setInputSurveyData] = useState({
        question_type: '',
        question_text: '',
        options: [{}],
        flag: 2,
        dupCategoryId: '',
        counter: 1
    })

    // console.log('(QuestionInput) inputSurveyData - ', inputSurveyData);

    const [buttonRendering, setButtonRendering] = useState({
        category_survey_name_submitted : false,
        add_que_pressed : false,
        show_new_que: false
    })

    const [errors, setErrors] = useState("")

    function handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        setInputSurveyData({ ...inputSurveyData, [name]: value});
    }

    function handleOptionValue(index, event){
        let name = event.target.name;
        let value = event.target.value;

        let data = [...inputSurveyData.options];
        data[index][name] = value;

        //stroing the option values in optionValues state
        setInputSurveyData({...inputSurveyData, options: data})
    }

    function removeOption(index) {

        let data = [...inputSurveyData.options]
        data.splice(index, 1);
        setInputSurveyData({...inputSurveyData, options: data});
    }

    function addOptions(){
        let newOption = {}

        setInputSurveyData({...inputSurveyData, options: [...inputSurveyData.options, newOption]})
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
                        // console.log('(QuestionInput) inside updatedSurvey - '. survey)
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

    //event handler for when the user presses new question
    function handleNewQuestion() {
        
        setErrors();
        setInputSurveyData({...inputSurveyData, 
        counter: inputSurveyData.counter+1,
        question_type: '',
        question_text: '',
        options: [{}]})
        setButtonRendering({...buttonRendering, add_que_pressed: false})
        
    }

    function handleQuestionSubmit(event){
        event.preventDefault();
        let returnedVal = props.updatingFunction(surveyInfo);

        if(returnedVal){
            setButtonRendering({...buttonRendering, add_que_pressed: false, show_new_que: false})
        }
    }

    return(
        <>
            <div className={AddSurveyCSS.containerStyle}>
            {
                props?.buttonRendering?.category_survey_name_submitted ? (

                    <form onSubmit={handleQuestionSubmit}>
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
                    </form>
                ):(<p>....</p>)
            }
            {errors?.length!==0 && <p className='fs-6 text-center text-danger'>{errors}</p>}
            </div>
        </>
    )
}

export default QuestionInput;