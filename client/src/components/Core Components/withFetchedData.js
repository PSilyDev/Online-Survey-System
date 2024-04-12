import React from "react";

const UpdatedComponent = (OriginalComponent) => {
    function NewComponent (){
        return(
            <OriginalComponent name="Prakhar" />
        )
    }

    return NewComponent
}

export default UpdatedComponent