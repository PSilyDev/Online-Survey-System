import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const UpdatedComponent = (OriginalComponent) => {

    
    function NewComponent (){
        
        const [fetchedSurveyData, setFetchedSurveyData] = useState([]);
        const [isLoading, setIsLoading] = useState(true);

        const [postData, setPostData] = useState('initial data....');
        // const [replyReceived, setReplyReceived] = useState();

        // console.log('fetched survey data (hoc) - ', fetchedSurveyData);
        // console.log('dataToPost data - ', postData);
        useEffect(() => {
           
            try{
                // get survey data from DB and store in fetchedSurveyData
                axios.get('http://localhost:4000/survey-api/surveys', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => { 
                    // console.log('hoc - ', response)
                    setFetchedSurveyData(response.data.payload || [])
                    setIsLoading(false);
                })
                .catch(error => console.log('Error fetching categories : ', error));
            }
            catch(error){
                console.log('Error fetching survey data : ', error);
            }
        }, [])

        const dataToPost = async (dataReceived, operation, url) => {
            // setPostData('data updated from child component...')
            console.log('(HOC) data recived - ', dataReceived);
            console.log('(HOC) operation - ', operation);
            console.log('(HOC) url - ', url);

            // return ('data returned from function.')
            let replyReceived;
            if(operation === 'post'){
                replyReceived = await axios.post(url, dataReceived, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                
            }
            if(operation === 'put'){
                replyReceived = await axios.put(url, dataReceived, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                
            }

            return replyReceived;
        }

        if(isLoading){
            return <div>Loading...</div>
        }

        return(
            <OriginalComponent data={fetchedSurveyData} postFunction={dataToPost} />
        )
    }

    return NewComponent
}

export default UpdatedComponent