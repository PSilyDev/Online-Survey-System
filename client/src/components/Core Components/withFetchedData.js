import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const UpdatedComponent = (OriginalComponent) => {

    
    function NewComponent (){
        
        const [fetchedSurveyData, setFetchedSurveyData] = useState([]);
        const [isLoading, setIsLoading] = useState(true);

        console.log('fetched survey data (hoc) - ', fetchedSurveyData);
        useEffect(() => {
           
            try{
                // get survey data from DB and store in fetchedSurveyData
                axios.get('http://localhost:4000/survey-api/surveys', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => { console.log('hoc - ', response)
                    setFetchedSurveyData(response.data.payload || [])
                    setIsLoading(false);
                })
                .catch(error => console.log('Error fetching categories : ', error));
            }
            catch(error){
                console.log('Error fetching survey data : ', error);
            }
        }, [])

        if(isLoading){
            return <div>Loading...</div>
        }

        return(
            <OriginalComponent data={fetchedSurveyData} />
        )
    }

    return NewComponent
}

export default UpdatedComponent