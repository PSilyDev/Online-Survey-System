import { useState, useEffect } from "react";
function Test(){

    let [test, setTest] = useState('');

    useEffect(() => {
        setTest('hello');
},[]);
        
    return(
        <>
            
        </>
    );
}

export default Test;