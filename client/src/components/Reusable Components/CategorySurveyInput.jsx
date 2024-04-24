import { useEffect, useState } from 'react';
import AddSurveyCSS from '../Core Components/css/AddSurveyStyling.module.css'

function CategorySurveyInput(props) {

    const fetchedSurveyData = props.data;


    const [inputSurveyData, setInputSurveyData] = useState({
        category_name: '',
        survey_name: '',
        flag: 2, //pass
        dupCategoryId: '', //pass
    })

    const [buttonRendering, setButtonRendering] = useState({
        category_survey_name_submitted : false, //pass
    })

    const [errors, setErrors] = useState("")

    function handleChange(event){
        let name = event.target.name;
        let value = event.target.value;

        setInputSurveyData({ ...inputSurveyData, [name]: value});
    }

    // Note - we are taking categoryNameValue because we have to first validate whether category, survey exists and then store in surveyInfo\
    
    //once the user enters the Category, Survey Name, he'll press submit whcich will trgger this event
    function handleCategoryNameSubmit(event){
        event.preventDefault();

        // check if the user pressed the submit button without entering the Category, Survey Name
        if(!inputSurveyData.category_name || inputSurveyData.category_name.trim() === ""){
            setErrors('Please enter category');
        }
        else if(!inputSurveyData.survey_name || inputSurveyData.survey_name.trim() === ""){
            setErrors('Please enter survey name');
        }
        else if(Object.keys(inputSurveyData).length === 0){            
            setErrors('Please enter Category and Survey name');
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
            setInputSurveyData({...inputSurveyData, dupCategoryId: categoryId, flag: flagVal});

            if(flagVal === 0){
                // console.log('category, name both exist!!!');
                setErrors('category, name both exist!!!');
            }

            else if(flagVal === 1){
                setErrors('category already exists, adding a new survey within the same category')
                // console.log('only category exists');
                //we'll only store the survey information in the surveyInfo state
                
                setButtonRendering({...buttonRendering, category_survey_name_submitted : true});
                
            }

            else if(flagVal === 2){
                // console.log('nothing exists!!!');

                setButtonRendering({...buttonRendering, category_survey_name_submitted : true});
                
            }
            
        }

    }

    useEffect(() => {
        if(buttonRendering.category_survey_name_submitted){
            // console.log('(CategorySurveyInput) inputSurveyData - ', inputSurveyData);
            
            
            props.updatingFunction(inputSurveyData.flag, inputSurveyData.dupCategoryId, inputSurveyData.category_name, inputSurveyData.survey_name);
            // props.updatingFunction(inputSurveyData);
        }

    }, [buttonRendering.category_survey_name_submitted])

    
    return(
        <>
            
            <div className={AddSurveyCSS.containerStyle}>
            {/* <form onSubmit={handleQuestionSubmit}> */}
            <form>
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
                    ):(undefined)
                }
            </form>
            </div>
            
        </>
    )
}

export default CategorySurveyInput;